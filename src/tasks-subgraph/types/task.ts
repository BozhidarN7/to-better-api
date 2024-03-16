import { ObjectId } from 'mongodb';
import { Categories, Priorities } from '../enums';
import DayOfWeek from './day-of-week';

interface Task {
  _id: ObjectId;
  title: string;
  description: string;
  priority: Priorities;
  category: Categories;
  isCompleted: boolean;
  dayOfWeek: DayOfWeek;
  weekId: string;
}

export default Task;
