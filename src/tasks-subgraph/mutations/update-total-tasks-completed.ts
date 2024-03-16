import { Collection, ObjectId } from 'mongodb';
import { Week } from '../types';
import { populateTasksInDaysOfWeek } from '../../db/tasks-pipeline-steps';

export default async function updateTotalTasksCompleted(
  _: undefined,
  args: { weekId: string; increase: boolean },
  { weeks }: { weeks: Collection<Week> },
) {
  const { weekId, increase } = args;

  const filter = { _id: new ObjectId(weekId) };
  const update = {
    $inc: {
      tasksCompleted: increase ? 1 : -1,
    },
  };
  const updateStatus = await weeks.updateOne(filter, update);

  if (updateStatus.modifiedCount === 0) {
    return {
      success: false,
      message: 'Week not found',
      code: '400',
      week: null,
    };
  }

  const pipeline = [
    {
      $match: {
        _id: new ObjectId(weekId),
      },
    },
    ...populateTasksInDaysOfWeek,
  ];
  const weekData = await weeks.aggregate(pipeline).toArray();
  return {
    success: true,
    message: 'Total tasks completed updated successfully',
    code: '200',
    week: weekData[0],
  };
}
