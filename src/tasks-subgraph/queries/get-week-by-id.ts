import { Collection, ObjectId } from 'mongodb';
import { Week } from '../types';

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
    {
      $lookup: {
        from: 'tasks',
        localField: 'tasks.monday',
        foreignField: '_id',
        as: 'tasks.monday',
      },
    },
    {
      $lookup: {
        from: 'tasks',
        localField: 'tasks.tuesday',
        foreignField: '_id',
        as: 'tasks.tuesday',
      },
    },
    {
      $lookup: {
        from: 'tasks',
        localField: 'tasks.wednesday',
        foreignField: '_id',
        as: 'tasks.wednesday',
      },
    },
    {
      $lookup: {
        from: 'tasks',
        localField: 'tasks.thursday',
        foreignField: '_id',
        as: 'tasks.thursday',
      },
    },
    {
      $lookup: {
        from: 'tasks',
        localField: 'tasks.friday',
        foreignField: '_id',
        as: 'tasks.friday',
      },
    },
    {
      $lookup: {
        from: 'tasks',
        localField: 'tasks.saturday',
        foreignField: '_id',
        as: 'tasks.saturday',
      },
    },
    {
      $lookup: {
        from: 'tasks',
        localField: 'tasks.sunday',
        foreignField: '_id',
        as: 'tasks.sunday',
      },
    },
  ];
  const weekData = await weeks.aggregate(pipeline).toArray();
  return weekData[0];
}
