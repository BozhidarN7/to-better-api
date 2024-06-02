import { ApolloServer } from '@apollo/server';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { startStandaloneServer } from '@apollo/server/standalone';
import 'dotenv/config';
import gql from 'graphql-tag';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import mutations from './mutations/mutations';
// import queries from './queries/queries';
import client from '../db/mongodb-client';
import { User } from './types';

const typeDefs = gql(
  readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'users.graphql'), {
    encoding: 'utf-8',
  }),
);

const resolvers = {
  //   Query: queries,
  Mutation: mutations,
};

const server = new ApolloServer({
  schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4002 },
  context: async () => {
    const toBetterDB = client.db('to-better');
    const usersCollection = toBetterDB.collection<User>('users');
    return {
      users: usersCollection,
    };
  },
});

// eslint-disable-next-line no-console
console.log(`🚀  Server ready at: ${url}`);
