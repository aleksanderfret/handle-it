import { Response } from 'express';
import { MiddlewareFn } from 'type-graphql';
import { sign, verify, VerifyOptions } from 'jsonwebtoken';
import { randomBytes } from 'crypto';

import User from '@modules/user/entity';
import { AccountStatus } from '@shared/enums';
import environment from '@env/env';
import { Context } from '@shared/types';

const {
  ACCESS_PRIVATE_KEY,
  ACCESS_PUBLIC_KEY,
  ACCESS_TOKEN_EXP,
  REFRESH_PRIVATE_KEY,
  REFRESH_PUBLIC_KEY,
  REFRESH_TOKEN_EXP,
  TOKEN_PRIVATE_KEY,
  TOKEN_PUBLIC_KEY
} = environment;

export interface JwtPayload {
  exp: number;
  iat: number;
  jwtid: string;
  userId: string;
  tokenVersion?: number;
}

type Signer = (id: string, tokenVersion?: number) => string;

type Verifier = (token: string, options?: VerifyOptions) => JwtPayload;

const createSigner =
  (key: string) =>
  (expiration: number): Signer =>
  (id: string, tokenVersion?: number) => {
    const jwtid = randomBytes(32).toString('hex');
    const iat = Math.floor(new Date().getTime() / 1000);
    const exp = iat + expiration;
    const privateKey = Buffer.from(key, 'base64').toString('utf-8');

    const payload = { exp, iat, jwtid, userId: id } as JwtPayload;

    if (tokenVersion !== undefined) {
      payload.tokenVersion = tokenVersion;
    }

    return sign(payload, privateKey, { algorithm: 'RS256', jwtid });
  };

const createVerifier =
  (key: string): Verifier =>
  (token: string, options?: VerifyOptions) => {
    const publicKey = Buffer.from(key, 'base64').toString('utf-8');

    const payload = verify(token, publicKey, options);

    return payload as JwtPayload;
  };

export const createAccessToken =
  createSigner(ACCESS_PRIVATE_KEY)(ACCESS_TOKEN_EXP);

export const createRefreshToken =
  createSigner(REFRESH_PRIVATE_KEY)(REFRESH_TOKEN_EXP);

export const createToken = createSigner(TOKEN_PRIVATE_KEY);

export const verifyAccessToken = createVerifier(ACCESS_PUBLIC_KEY);

export const verifyRefreshToken = createVerifier(REFRESH_PUBLIC_KEY);

export const verifyToken = createVerifier(TOKEN_PUBLIC_KEY);

export const isAuth: MiddlewareFn<Context> = async ({ context }, next) => {
  const {
    req: { headers }
  } = context;

  const { authorization } = headers;

  if (!authorization) {
    throw new Error('not Authorized');
  }

  try {
    const [, token] = authorization.split(' ');

    const payload = verifyAccessToken(token);

    const { userId } = payload;

    const user = await User.findOne({
      id: userId,
      status: AccountStatus.Active
    });

    if (user) {
      context.user = user;
    }
  } catch (error) {
    throw new Error('not Authorized');
  }

  return next();
};

export const sendRefreshToken = (res: Response, token: string) =>
  res.cookie('refreshToken', token, {
    httpOnly: true,
    path: '/api/auth/refresh-token'
  });

export const checkIsTokenExpired = (token: string): Boolean => {
  const { exp } = createVerifier(TOKEN_PUBLIC_KEY)(token, {
    ignoreExpiration: true
  });

  return Date.now() >= exp * 1000;
};
