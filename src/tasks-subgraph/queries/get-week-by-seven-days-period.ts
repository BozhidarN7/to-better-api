import { Collection, ObjectId } from 'mongodb';
import { SevenDaysPeriod, Week } from '../types';

export default async function getWeekBySevenDaysPeriod(
  _: undefined,
  {
    sevenDaysPeriod,
    isSelected,
  }: { sevenDaysPeriod: SevenDaysPeriod; isSelected: boolean },
  { weeks }: { weeks: Collection<Week> },
) {
  const { startDate, endDate } = sevenDaysPeriod;
  const week = await weeks.findOneAndUpdate(
    {
      'sevenDaysPeriod.startDate': startDate,
      'sevenDaysPeriod.endDate': endDate,
    },
    { $set: { isSelected: isSelected } },
  );

  if (!week) {
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

    return await weeks.findOne({ _id: newWeek.insertedId });
  }

  return week;
}
