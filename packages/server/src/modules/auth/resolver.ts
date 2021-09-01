import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Resolver,
  UseMiddleware
} from 'type-graphql';
import { getManager } from 'typeorm';
import { compare, hash } from 'bcryptjs';

import { AccountStatus, TokenType } from '@shared/enums';
import { Context } from '@shared/types';
import {
  isAuth,
  createAccessToken,
  createRefreshToken,
  createToken,
  sendRefreshToken,
  verifyToken
} from '@modules/auth/auth';
import Token from './entity';
import {
  sendRemoveAccountConfirmation,
  sendResetPasswordConfirmation,
  sendSignUpConfirmation
} from '@modules/mailer';
import User from '@modules/user/entity';
import { BadRequestError, ValidationError } from '@errors/index';
import { ErrorReason } from '@errors/enums';
import environment from '@env/env';

const {
  APP_URL,
  CONFIRM_SIGN_UP_TOKEN_EXP,
  REMOVE_ACCOUNT_TOKEN_EXP,
  RESET_PASSWORD_TOKEN_EXP
} = environment;
@ObjectType()
class SignInResponse {
  @Field(() => User)
  user!: User;
  @Field()
  accessToken!: string;
}

@ObjectType()
class ChangePasswordResponse {
  @Field()
  accessToken!: string;
}
@Resolver()
export class AuthResolver {
  @UseMiddleware(isAuth)
  @Mutation(() => ChangePasswordResponse)
  async changePassword(
    @Arg('email') email: string,
    @Arg('oldPassword') oldPassword: string,
    @Arg('password') password: string,
    @Arg('passwordConfirmation') passwordConfirmation: string,
    @Ctx() { res }: Context
  ) {
    if (password !== passwordConfirmation) {
      // TODO throw new ValidationError
      throw new ValidationError(
        'Password mismatch',
        ErrorReason.PasswordMismatch
      );
    }

    const user = await User.findOne({
      email,
      status: AccountStatus.Active
    });

    if (!user) {
      throw new ValidationError(
        'Invalid credentials',
        ErrorReason.InvalidCredentialsError
      );
    }

    const valid = await compare(oldPassword, user.password);

    if (!valid) {
      throw new ValidationError(
        'Invalid credentials',
        ErrorReason.InvalidCredentialsError
      );
    }

    // TODO revoke tokens
    const hashedPassword = await hash(password, 12);
    const tokenVersion = user.tokenVersion + 1;
    user.password = hashedPassword;
    user.tokenVersion = tokenVersion;

    await user.save();

    res.clearCookie('refreshToken', { path: '/api/auth/refresh-token' });

    sendRefreshToken(res, createRefreshToken(user.id, tokenVersion));

    return {
      accessToken: createAccessToken(user.id, tokenVersion)
    };
  }

  @Mutation(() => Boolean)
  async confirmSignUp(@Arg('tokenId') tokenId: string) {
    const token = await Token.findOne({ id: tokenId });

    if (!token) {
      // TODO If there is no token and there is no user also
      // this account was deleted due to email not being
      // confirmed for n days
      throw new BadRequestError();
    }

    const { token: jwtToken } = token;

    const payload = verifyToken(jwtToken, {
      ignoreExpiration: true
    });

    const { exp, userId: id } = payload;

    if (Date.now() >= exp * 1000) {
      throw new ValidationError(
        'Link has expired',
        ErrorReason.ExpiredLinkError
      );
    }

    await getManager().update(
      User,
      { id, status: AccountStatus.Registered },
      { activeAt: new Date(), status: AccountStatus.Active }
    );

    await Token.delete({ id: tokenId });

    return true;
  }

  @Mutation(() => Boolean)
  async resendSignUpConfirmation(
    @Arg('tokenId') tokenId: string,
    @Ctx() { req: { locale } }: Context
  ) {
    if (!tokenId) {
      throw new BadRequestError();
    }

    const token = await Token.findOne({ id: tokenId });

    if (!token) {
      // TODO If there is no token and there is no user also
      // this account was deleted due to email not being
      // confirmed for 30 days
      throw new BadRequestError();
    }

    const { token: jwtToken } = token;

    const payload = verifyToken(jwtToken, {
      ignoreExpiration: true
    });

    const { userId: id } = payload;

    const user = await User.findOne({ id, status: AccountStatus.Registered });

    if (!user) {
      // TODO If there is no token and there is no user also
      // this account was deleted due to email not being
      // confirmed for 30 days
      throw new BadRequestError();
    }

    const { email } = user;

    const newToken = createToken(CONFIRM_SIGN_UP_TOKEN_EXP)(id);

    await getManager().update(Token, { id: tokenId }, { token: newToken });

    const redirectUrl = `${APP_URL}/sign-up-confirmation/${tokenId}`;

    try {
      await sendSignUpConfirmation({
        locale,
        recipient: email,
        redirectUrl,
        user: { email }
      });
    } catch {
      throw new BadRequestError(
        'Sending confirmation failed',
        ErrorReason.SendingFailedError
      );
    }

    return true;
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Boolean)
  async removeAccount(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() { req: { locale }, user }: Context
  ) {
    if (user) {
      const { id, password } = user;

      const valid = await compare(password, user.password);

      if (email !== user.email && !valid) {
        throw new ValidationError(
          'Invalid credentials',
          ErrorReason.InvalidCredentialsError
        );
      }

      await Token.delete({ type: TokenType.DeleteAccountToken, user: user });

      const token = createToken(REMOVE_ACCOUNT_TOKEN_EXP)(id);

      const {
        identifiers: [{ id: tokenId }]
      } = await Token.insert({
        token,
        type: TokenType.ResetPasswordToken,
        user
      });

      const redirectUrl = `${APP_URL}/remove-account/${tokenId}`;

      try {
        await sendRemoveAccountConfirmation({
          locale,
          recipient: email,
          redirectUrl,
          user: { email }
        });
      } catch {
        throw new BadRequestError(
          'Sending confirmation failed',
          ErrorReason.SendingFailedError
        );
      }
    }
  }

  @Mutation(() => Boolean)
  async removeAccountConfirmation(@Arg('tokenId') tokenId: string) {
    const token = await Token.findOne({ id: tokenId });

    if (!token) {
      // TODO If there is no token and there is no user also
      // this account was deleted due to email not being
      // confirmed for n days
      throw new BadRequestError();
    }

    const { token: jwtToken } = token;

    const payload = verifyToken(jwtToken, {
      ignoreExpiration: true
    });

    const { exp, userId: id } = payload;

    if (Date.now() >= exp * 1000) {
      throw new ValidationError(
        'Link has expired',
        ErrorReason.ExpiredLinkError
      );
    }

    const user = await User.findOne({ id });

    if (user) {
      const { email } = user;

      const hashedEmail = await hash(email, 12);

      user.avatarUrl = '';
      user.deletedAt = new Date();
      user.email = hashedEmail;
      user.name = '';
      user.password = '';
      user.provider = '';
      user.status = AccountStatus.Deleted;

      await user.save();
      await Token.delete({ id: tokenId });
    }

    // TODO revoke tokens

    return true;
  }

  @Mutation(() => Boolean)
  async resetPassword(
    @Arg('email') email: string,
    @Ctx() { req: { locale } }: Context
  ) {
    const user = await User.findOne({
      email,
      status: AccountStatus.Active
    });

    if (user) {
      const { id } = user;

      await Token.delete({ type: TokenType.ResetPasswordToken, user });

      await getManager().increment(User, { id }, 'tokenVersion', 1);

      const token = createToken(RESET_PASSWORD_TOKEN_EXP)(id);

      const {
        identifiers: [{ id: tokenId }]
      } = await Token.insert({
        token,
        type: TokenType.ResetPasswordToken,
        user
      });

      const redirectUrl = `${APP_URL}/update-password/${tokenId}`;

      try {
        await sendResetPasswordConfirmation({
          locale,
          recipient: email,
          redirectUrl,
          user: { email }
        });
      } catch {
        throw new BadRequestError(
          'Sending confirmation failed',
          ErrorReason.SendingFailedError
        );
      }
    }

    return true;
  }

  @Mutation(() => Boolean)
  async retrySignUpConfirmation(
    @Arg('email') email: string,
    @Ctx() { req: { locale } }: Context
  ) {
    const user = await User.findOne({
      email,
      status: AccountStatus.Registered
    });

    if (!user) {
      throw new BadRequestError();
    }

    const { id } = user;

    const token = await Token.findOne({
      type: TokenType.SignUpConfirmToken,
      user
    });

    if (!token) {
      throw new BadRequestError();
    }

    const { id: tokenId } = token;

    const jwtToken = createToken(CONFIRM_SIGN_UP_TOKEN_EXP)(id);

    await getManager().update(Token, { id: tokenId }, { token: jwtToken });

    const redirectUrl = `${APP_URL}/sign-up-confirmation/${tokenId}`;

    try {
      await sendSignUpConfirmation({
        locale,
        recipient: email,
        redirectUrl,
        user: { email }
      });
    } catch {
      throw new BadRequestError(
        'Sending confirmation failed',
        ErrorReason.SendingFailedError
      );
    }

    return true;
  }

  @Mutation(() => SignInResponse)
  async signIn(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() { res }: Context
  ): Promise<SignInResponse> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new ValidationError(
        'Invalid credentials',
        ErrorReason.InvalidCredentialsError
      );
    }

    const valid = await compare(password, user.password);

    if (!valid) {
      throw new ValidationError(
        'Invalid credentials',
        ErrorReason.InvalidCredentialsError
      );
    }

    const { id, status, tokenVersion } = user;

    if (status !== AccountStatus.Active) {
      throw new BadRequestError(
        'Account Not Active',
        ErrorReason.AccountNotConfirmedError
      );
    }

    sendRefreshToken(res, createRefreshToken(id, tokenVersion));

    return {
      accessToken: createAccessToken(id, tokenVersion),
      user
    };
  }

  @Mutation(() => Boolean)
  async signOut(@Ctx() { res }: Context) {
    res.clearCookie('refreshToken', { path: '/api/auth/refresh-token' });

    return true;
  }

  @Mutation(() => Boolean)
  async signUp(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Arg('passwordConfirmation') passwordConfirmation: string,
    @Ctx() { req: { locale } }: Context
  ) {
    if (password !== passwordConfirmation) {
      // TODO throw new ValidationError
      throw new ValidationError(
        'Password mismatch',
        ErrorReason.PasswordMismatch
      );
    }

    const user = await User.findOne({ email });

    if (user) {
      throw new BadRequestError(
        'User already exists',
        ErrorReason.AlreadyExistsError
      );
    }

    const hashedPassword = await hash(password, 12);

    const newUser = await User.insert({
      email,
      password: hashedPassword,
      status: AccountStatus.Registered
    });

    const { identifiers } = newUser;

    const [{ id }] = identifiers;

    const token = createToken(CONFIRM_SIGN_UP_TOKEN_EXP)(id);

    const {
      identifiers: [{ id: tokenId }]
    } = await Token.insert({
      token,
      type: TokenType.SignUpConfirmToken,
      user: id
    });

    const redirectUrl = `${APP_URL}/sign-up-confirmation/${tokenId}`;

    try {
      await sendSignUpConfirmation({
        locale,
        recipient: email,
        redirectUrl,
        user: { email }
      });
    } catch (error) {
      console.error(error);

      throw new BadRequestError(
        'Sending confirmation failed',
        ErrorReason.SendingFailedError
      );
    }

    return true;
  }

  @Mutation(() => Boolean)
  async updatePassword(
    @Arg('tokenId') tokenId: string,
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Arg('passwordConfirmation') passwordConfirmation: string,
    @Ctx() { res }: Context
  ) {
    if (password !== passwordConfirmation) {
      // TODO throw new ValidationError
      throw new ValidationError(
        'Password mismatch',
        ErrorReason.PasswordMismatch
      );
    }

    const token = await Token.findOne({ id: tokenId });

    if (!token) {
      throw new BadRequestError();
    }

    const { token: jwtToken } = token;

    const payload = verifyToken(jwtToken, {
      ignoreExpiration: true
    });

    const { exp, userId: id } = payload;

    if (Date.now() >= exp * 1000) {
      throw new ValidationError(
        'Link has expired',
        ErrorReason.ExpiredLinkError
      );
    }

    const user = await User.findOne({
      email,
      status: AccountStatus.Active
    });

    if (!user) {
      throw new BadRequestError();
    }

    const hashedPassword = await hash(password, 12);
    const tokenVersion = user.tokenVersion + 1;
    // TODO revoke tokens
    await getManager().update(
      User,
      { email, id, status: AccountStatus.Active },
      { password: hashedPassword, tokenVersion }
    );

    res.clearCookie('refreshToken', { path: '/api/auth/refresh-token' });

    await Token.delete({ id: tokenId });

    return true;
  }
}

//TODO validate userId, email, password, tokenId
