import { tasksData } from '../mock';

export default function getWeekById(
  _: undefined,
  { weekId }: { weekId: string },
) {
  return tasksData.find((week) => week._id === weekId);
}
