import getWeekById from './get-week-by-id';
import getWeeks from './get-weeks';
import getWeekBySevenDaysPeriod from './get-week-by-seven-days-period';

export default {
  weeks: getWeeks,
  week: getWeekById,
  weeksBySevenDaysPeriod: getWeekBySevenDaysPeriod,
};
