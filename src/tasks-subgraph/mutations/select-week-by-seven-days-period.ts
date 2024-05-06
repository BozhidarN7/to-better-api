import { Collection, ObjectId } from 'mongodb';
import { SevenDaysPeriod, Week } from '../types';
import { populateTasksInDaysOfWeek } from '../../db/tasks-pipeline-steps';

export default async function selectWeekBySevenDaysPeriod(
  _: undefined,
  {
    sevenDaysPeriod,
    isSelected,
  }: { sevenDaysPeriod: SevenDaysPeriod; isSelected: boolean },
  { weeks }: { weeks: Collection<Week> },
) {
  const { startDate, endDate } = sevenDaysPeriod;

  const res = await weeks.findOneAndUpdate(
    {
      'sevenDaysPeriod.startDate': startDate,
      'sevenDaysPeriod.endDate': endDate,
    },
    {
      $set: {
        isSelected: isSelected,
      },
    },
  );

  if (!res) {
    const newWeek = await weeks.insertOne({
      _id: new ObjectId(),
      sevenDaysPeriod: {
        startDate,
        endDate,
      },
      totalTasks: 0,
      tasksCompleted: 0,
      isSelected: true,
      tasks: {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: [],
      },
    });

    const week = await weeks.findOne({ _id: newWeek.insertedId });

    return {
      code: '200',
      success: true,
      message: 'Week selected successfully',
      week: week,
    };
  }

  const pipeline = [
    {
      $match: {
        _id: res._id,
      },
    },
    ...populateTasksInDaysOfWeek,
  ];

  const weekData = await weeks.aggregate(pipeline).toArray();

  return {
    code: '200',
    success: true,
    message: 'Week selected successfully',
    week: weekData[0],
  };
}
