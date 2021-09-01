import { Ctx, Query, Resolver, UseMiddleware } from 'type-graphql';

import { Context } from '@shared/types';
import { isAuth } from '@modules/auth/auth';
import User from './entity';

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return 'hi!';
  }

  @UseMiddleware(isAuth)
  @Query(() => String)
  bye(@Ctx() { user }: Context) {
    return `Your user id is ${user?.id}.`;
  }

  @Query(() => [User])
  users() {
    return User.find();
  }

  @UseMiddleware(isAuth)
  @Query(() => User, { nullable: true })
  async currentUser(@Ctx() { user }: Context) {
    try {
      if (!user) {
        throw new Error();
      }

      const { id } = user;

      const currentUser = await User.findOne(id);

      return currentUser;
    } catch (error) {
      console.error(error);

      return null;
    }
  }
}
