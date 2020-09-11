import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';

import environment from '../environment';
import { UserResolver } from '@modules/user/resolver';

const { NODE_ENV } = environment;

export const startApollo = async (): Promise<ApolloServer> => {
  const schema = await buildSchema({
    resolvers: [UserResolver]
  });

  const server = new ApolloServer({
    playground: NODE_ENV === 'development',
    schema
  });

  return server;
};
