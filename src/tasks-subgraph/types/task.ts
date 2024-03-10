import { Categories, Priorities } from '../enums';

interface Task {
  _id: string;
  title: string;
  description: string;
  priority: Priorities;
  category: Categories;
  isCompleted: boolean;
}

export default Task;
