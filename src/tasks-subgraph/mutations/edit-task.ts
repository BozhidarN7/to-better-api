import { Collection, ObjectId } from 'mongodb';
import { Task } from '../types';

export default async function editTask(
  _: undefined,
  args: { taskId: string; task: Task },
  { tasks }: { tasks: Collection<Task> },
) {
  const { task, taskId } = args;

  const filter = { _id: new ObjectId(taskId) };
  const update = { $set: { ...task } };
  const updateStatus = await tasks.updateOne(filter, update);

  if (updateStatus.modifiedCount === 0) {
    return {
      success: false,
      message: 'Unable to update task',
      code: '400',
      task: null,
    };
  }
  const updatedTask = await tasks.findOne({ _id: new ObjectId(taskId) });
  return {
    success: true,
    message: 'Task edited successfully',
    code: '200',
    task: updatedTask,
  };
}
