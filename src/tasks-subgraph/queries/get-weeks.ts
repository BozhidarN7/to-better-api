import { Collection } from 'mongodb';
import { Week } from '../types';
import { populateTasksInDaysOfWeek } from '../../db/tasks-pipeline-steps';

export default async function getWeeks(
  _: undefined,
  __: undefined,
  { weeks }: { weeks: Collection<Week> },
) {
  const pipeline = [
    {
      $match: {
        isSelected: true,
      },
    },
    ...populateTasksInDaysOfWeek,
  ];
  const weeksData = await weeks.aggregate(pipeline).toArray();
  return weeksData;
}
