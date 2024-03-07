import { tasksData } from '../mock';
import { DayOfWeek, Task } from '../types';

export default function createTask(
  _: undefined,
  args: { weekId: string; dayOfWeek: DayOfWeek; task: Task },
) {
  const { weekId, dayOfWeek, task } = args;

  const weeklyTasks = tasksData.find(
    (weeklyTasks) => weeklyTasks.id === weekId,
  );

  if (!weeklyTasks) {
    return {
      success: false,
      message: 'Week not found',
      code: '400',
      task: null,
    };
  }

  const dayToLowerCase = dayOfWeek.toLowerCase() as DayOfWeek;

  const newTask = { ...task, id: 'task1', isCompleted: false };
  weeklyTasks.tasks[dayToLowerCase].push(newTask);
  weeklyTasks.totalTasks += 1;

  return {
    success: true,
    message: 'Task created successfully',
    code: '200',
    task: newTask,
  };
}
