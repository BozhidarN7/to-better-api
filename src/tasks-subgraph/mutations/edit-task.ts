import { tasksData } from '../mock';
import { DayOfWeek, Task } from '../types';

export default function editTask(
  _: undefined,
  args: { weekId: string; dayOfWeek: DayOfWeek; taskId: string; task: Task },
) {
  const { task, weekId, taskId, dayOfWeek } = args;
  const weeklyTasks = tasksData.find(
    (weeklyTasks) => weeklyTasks._id === weekId,
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

  const taskToEditIndex = weeklyTasks.tasks[dayToLowerCase].findIndex(
    (task: Task) => task._id === taskId,
  );

  if (taskToEditIndex === -1) {
    return {
      success: false,
      message: 'Task not found',
      code: '400',
      task: null,
    };
  }

  weeklyTasks.tasks[dayToLowerCase][taskToEditIndex] = task;
  return {
    success: true,
    message: 'Task edited successfully',
    code: '200',
    task: weeklyTasks.tasks[dayToLowerCase][taskToEditIndex],
  };
}
