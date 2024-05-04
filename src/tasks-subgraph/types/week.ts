import { ObjectId } from 'mongodb';
import Task from './task';
import SevenDaysPeriod from './seven-days-period';

interface Week {
  _id: ObjectId;
  totalTasks: number;
  tasksCompleted: number;
  sevenDaysPeriod: SevenDaysPeriod;
  isSelected: boolean;
  tasks: {
    monday: Task[];
    tuesday: Task[];
    wednesday: Task[];
    thursday: Task[];
    friday: Task[];
    saturday: Task[];
    sunday: Task[];
  };
}

export default Week;
