import Task from './task';

interface Week {
  _id: string;
  totalTasks: number;
  tasksCompleted: number;
  sevenDaysPeriod: {
    startDate: string;
    endDate: string;
  };
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
