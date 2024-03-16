import { Collection, ObjectId } from 'mongodb';
import { Week } from '../types';
import { populateTasksInDaysOfWeek } from '../../db/tasks-pipeline-steps';

export default async function getWeekById(
  _: undefined,
  { weekId }: { weekId: string },
  { weeks }: { weeks: Collection<Week> },
) {
  const pipeline = [
    {
      $match: {
        _id: new ObjectId(weekId),
      },
    },
    ...populateTasksInDaysOfWeek,
  ];
  const weekData = await weeks.aggregate(pipeline).toArray();
  return weekData[0];
}
