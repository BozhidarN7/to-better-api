import { ApolloServer } from '@apollo/server';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { startStandaloneServer } from '@apollo/server/standalone';
import gql from 'graphql-tag';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { tasksData } from './mock';
import { DayOfWeek } from './types';

const typeDefs = gql(
  readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'tasks.graphql'), {
    encoding: 'utf-8',
  }),
);

const resolvers = {
  Query: {
    weeks: () => tasksData,
    week: (_: undefined, { weekId }: { weekId: string }) =>
      tasksData.find((week) => week.id === weekId),
  },
  Mutation: {
    deleteTask(
      _: undefined,
      {
        weekId,
        day,
        taskId,
      }: { weekId: string; day: DayOfWeek; taskId: string },
    ) {
      const weeklyTasks = tasksData.find(
        (weeklyTasks) => weeklyTasks.id === weekId,
      );

      if (!weeklyTasks) {
        return {
          success: false,
          message: 'Week not found',
          code: '400',
          task: null,
        };
      }

      const dayToLowerCase = day.toLowerCase() as DayOfWeek;

      const taskToDeleteIndex = weeklyTasks.tasks[dayToLowerCase].findIndex(
        (task) => task.id === taskId,
      );

      if (taskToDeleteIndex === -1) {
        return {
          success: false,
          message: 'Task not found',
          code: '400',
          task: null,
        };
      }

      if (weeklyTasks.tasks[dayToLowerCase][taskToDeleteIndex].isCompleted) {
        weeklyTasks.tasksCompleted -= 1;
      }
      weeklyTasks.totalTasks -= 1;
      const deletedTask = weeklyTasks.tasks[dayToLowerCase].splice(
        taskToDeleteIndex,
        1,
      );

      return {
        success: true,
        message: 'Task deleted successfully',
        code: '200',
        task: deletedTask[0],
      };
    },
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
