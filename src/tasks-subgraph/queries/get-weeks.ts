import { Db } from 'mongodb';
import { tasksData } from '../mock';

export default function getWeeks(
  _: undefined,
  __: undefined,
  { db }: { db: Db },
) {
  db.tasks.find({});
}
