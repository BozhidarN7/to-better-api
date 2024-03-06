import { tasksData } from '../mock';
import { DayOfWeek } from '../types';

export default function deleteTask(
  _: undefined,
  { weekId, day, taskId }: { weekId: string; day: DayOfWeek; taskId: string }
) {
  const weeklyTasks = tasksData.find(
    (weeklyTasks) => weeklyTasks.id === weekId
  );

  if (!weeklyTasks) {
    return {
      success: false,
      message: 'Week not found',
      code: '400',
      task: null,
    };
  }

  const dayToLowerCase = day.toLowerCase() as DayOfWeek;

  const taskToDeleteIndex = weeklyTasks.tasks[dayToLowerCase].findIndex(
    (task) => task.id === taskId
  );

  if (taskToDeleteIndex === -1) {
    return {
      success: false,
      message: 'Task not found',
      code: '400',
      task: null,
    };
  }

  if (weeklyTasks.tasks[dayToLowerCase][taskToDeleteIndex].isCompleted) {
    weeklyTasks.tasksCompleted -= 1;
  }
  weeklyTasks.totalTasks -= 1;
  const deletedTask = weeklyTasks.tasks[dayToLowerCase].splice(
    taskToDeleteIndex,
    1
  );

  return {
    success: true,
    message: 'Task deleted successfully',
    code: '200',
    task: deletedTask[0],
  };
}
