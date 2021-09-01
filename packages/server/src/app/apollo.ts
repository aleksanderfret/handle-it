import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';

import environment from '@env/env';
import { AuthResolver } from '@modules/auth/resolver';
import { UserResolver } from '@modules/user/resolver';

const { NODE_ENV } = environment;

export const startApollo = async (): Promise<ApolloServer> => {
  const schema = await buildSchema({
    resolvers: [AuthResolver, UserResolver]
  });

  const server = new ApolloServer({
    context: ({ req, res }) => ({ req, res }),
    debug: NODE_ENV === 'development',
    schema
  });

  await server.start();

  return server;
};
