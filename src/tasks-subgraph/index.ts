import { ApolloServer } from '@apollo/server';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { startStandaloneServer } from '@apollo/server/standalone';
import gql from 'graphql-tag';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { tasksData } from './mock';

const typeDefs = gql(
  readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'tasks.graphql'), {
    encoding: 'utf-8',
  })
);

const resolvers = {
  Query: {
    weeks: () => tasksData,
    week: (_: undefined, { weekId }: { weekId: string }) =>
      tasksData.find((week) => week.id === weekId),
  },
};
// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
  listen: { port: 4001 },
});

console.log(`🚀  Server ready at: ${url}`);
