import tasksState from '../mock/tasks-data';

export default function updateTotalTasksCompleted(
  _: undefined,
  args: { weekId: string; increase: boolean },
) {
  const { weekId, increase } = args;
  const weeklyTasks = tasksState.find(
    (weeklyTasks) => weeklyTasks._id === weekId,
  );

  if (!weeklyTasks) {
    return {
      success: false,
      message: 'Week not found',
      code: '400',
      week: null,
    };
  }

  if (increase) {
    weeklyTasks.tasksCompleted += 1;
  } else {
    weeklyTasks.tasksCompleted -= 1;
  }

  return {
    success: true,
    message: 'Total tasks completed updated successfully',
    code: '200',
    week: weeklyTasks,
  };
}
