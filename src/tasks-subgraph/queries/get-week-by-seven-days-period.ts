import { Collection, ObjectId } from 'mongodb';
import { SevenDaysPeriod, Week } from '../types';

export default async function getWeekBySevenDaysPeriod(
  _: undefined,
  { sevenDaysPeriod }: { sevenDaysPeriod: SevenDaysPeriod },
  { weeks }: { weeks: Collection<Week> },
) {
  const { startDate, endDate } = sevenDaysPeriod;
  const week = await weeks.findOne({
    'sevenDaysPeriod.startDate': startDate,
    'sevenDaysPeriod.endDate': endDate,
  });

  if (!week) {
    const newWeek = await weeks.insertOne({
      _id: new ObjectId(),
      sevenDaysPeriod: {
        startDate,
        endDate,
      },
      totalTasks: 0,
      tasksCompleted: 0,
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

    return await weeks.findOne({ _id: newWeek.insertedId });
  }

  return week;
}
