import { ApolloServer } from '@apollo/server';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { startStandaloneServer } from '@apollo/server/standalone';
import gql from 'graphql-tag';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import mutations from './mutations/mutations';
import queries from './queries/queries';

const typeDefs = gql(
  readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'tasks.graphql'), {
    encoding: 'utf-8',
  }),
);

const resolvers = {
  Query: queries,
  Mutation: mutations,
};

const server = new ApolloServer({
  schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4001 },
});

console.log(`🚀  Server ready at: ${url}`);