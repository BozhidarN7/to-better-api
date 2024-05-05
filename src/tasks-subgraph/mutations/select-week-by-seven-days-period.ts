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

  const pipeline = [
    {
      $match: {
        'sevenDaysPeriod.startDate': startDate,
        'sevenDaysPeriod.endDate': endDate,
      },
    },
    {
      $addFields: {
        isSelected: isSelected,
      },
    },
    ...populateTasksInDaysOfWeek,
  ];

  const res = await weeks.aggregate(pipeline).toArray();

  if (res.length === 0) {
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

  return {
    code: '200',
    success: true,
    message: 'Week selected successfully',
    week: res[0],
  };
}
