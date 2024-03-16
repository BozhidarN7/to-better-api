import { Collection, ObjectId } from 'mongodb';
import { DayOfWeek, Task, Week } from '../types';

export default async function createTask(
  _: undefined,
  args: { weekId: string; dayOfWeek: DayOfWeek; task: Task },
  { weeks, tasks }: { weeks: Collection<Week>; tasks: Collection<Task> },
) {
  const { weekId, dayOfWeek, task } = args;

  const dayToLowerCase = dayOfWeek.toLowerCase();
  const newTaskId = new ObjectId();

  const filter = { _id: new ObjectId(weekId) };
  const update = {
    $push: {
      [`tasks.${dayToLowerCase}`]: newTaskId,
    },
    $inc: {
      totalTasks: 1,
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

  const newTask = { ...task, _id: newTaskId, isCompleted: false };
  const insertResult = await tasks.insertOne(newTask);

  if (insertResult.insertedId) {
    return {
      success: true,
      message: 'Task created successfully',
      code: '200',
      task: newTask,
    };
  }

  return {
    success: false,
    message: 'Task creation failed',
    code: '400',
    task: null,
  };
}
