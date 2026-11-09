/**
 * dailyTasks.js
 * Today's to-do list, made from the records themselves (thesis audit, section 16).
 * A task is done when the matching entry for today exists, so nobody ticks
 * boxes by hand: the list doubles as proof that the day's data was recorded.
 *
 * Pure: give it the data and the clock.
 */

import { filterActive } from './calculations.js';

/** "HH:MM" of a Date in local time. */
export function clockOf(d = new Date()) {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

/**
 * @param {object}   o
 * @param {object[]} o.openBatchesData  [{ batch, feed, mortality, sales }]
 * @param {object[]} o.expenses         farm expenses
 * @param {string}   o.today            YYYY-MM-DD
 * @param {string}   [o.now]            HH:MM, for overdue
 * @param {string}   [o.dueTime]        HH:MM
 * @param {object}   [o.marks]          day markers, e.g. { 'no-receipts:2026-11-07': true }
 * @returns {{ tasks: object[], done: number, total: number, overdue: number }}
 */
export function buildDailyTasks({ openBatchesData = [], expenses = [], today, now = '00:00', dueTime = '18:00', marks = {} }) {
  const tasks = [];

  for (const { batch, feed = [], mortality = [] } of openBatchesData) {
    if (!batch || batch.deleted_at || batch.start_date > today) continue;
    const name = batch.batch_name;
    const feedToday = filterActive(feed).filter((f) => f.entry_date === today);
    const deathsToday = filterActive(mortality).filter((m) => m.entry_date === today);

    tasks.push({
      id: `feed:${batch.batch_id}`,
      type: 'feed',
      batchId: batch.batch_id,
      label: `Record feed – ${name}`,
      due: dueTime,
      done: feedToday.length > 0,
      detail: feedToday.length ? `${feedToday.length} entr${feedToday.length === 1 ? 'y' : 'ies'} today` : null
    });

    const deathCount = deathsToday.reduce((s, m) => s + (Number(m.count) || 0), 0);
    tasks.push({
      id: `deaths:${batch.batch_id}`,
      type: 'deaths',
      batchId: batch.batch_id,
      label: `Record deaths – ${name}`,
      due: dueTime,
      done: deathsToday.length > 0,
      detail: deathsToday.length ? (deathCount === 0 ? 'No deaths today' : `${deathCount} recorded`) : null,
      canMarkNone: true
    });
  }

  if (tasks.length) {
    const receiptsToday = filterActive(expenses).filter((e) => e.entry_date === today);
    const markedNone = !!marks[`no-receipts:${today}`];
    tasks.push({
      id: 'receipts',
      type: 'receipts',
      batchId: null,
      label: "Record today's receipts",
      due: '20:00',
      done: receiptsToday.length > 0 || markedNone,
      detail: receiptsToday.length ? `${receiptsToday.length} recorded` : markedNone ? 'No receipts today' : null,
      canMarkNone: true
    });
  }

  for (const t of tasks) t.overdue = !t.done && now >= t.due;
  const done = tasks.filter((t) => t.done).length;
  return { tasks, done, total: tasks.length, overdue: tasks.filter((t) => t.overdue).length };
}
