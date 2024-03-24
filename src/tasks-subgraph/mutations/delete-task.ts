import { Collection, ObjectId } from 'mongodb';
import { DayOfWeek, Task, Week } from '../types';

export default async function deleteTask(
  _: undefined,
  { weekId, day, taskId }: { weekId: string; day: DayOfWeek; taskId: string },
  { weeks, tasks }: { weeks: Collection<Week>; tasks: Collection<Task> },
) {
  const dayToUpperCase = day.toUpperCase();

  const filter = { _id: new ObjectId(weekId) };
  const update = {
    $pull: {
      [`tasks.${dayToUpperCase}`]: new ObjectId(taskId),
    },
    $inc: {
      totalTasks: -1,
    },
  };
  const updateStatus = await weeks.updateOne(filter, update);

  if (updateStatus.modifiedCount === 0) {
    return {
      success: false,
      message: 'Week not found',
      code: '400',
      task: null,
    };
  }

  const taskToDelete = await tasks.findOne({ _id: new ObjectId(taskId) });
  const deleteStatus = await tasks.deleteOne({ _id: new ObjectId(taskId) });

  if (deleteStatus.deletedCount === 0) {
    return {
      success: false,
      message: 'Task not found',
      code: '400',
      task: null,
    };
  }

  return {
    success: true,
    message: 'Task deleted successfully',
    code: '200',
    task: taskToDelete,
  };
}
