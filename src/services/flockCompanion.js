import { filterActive } from './calculations.js';
import { daysBetween, addDays } from './guidedQuestions.js';

export const STAGE_LABEL = { chick: 'Baby chick', growing: 'Growing pullet', ready: 'Ready for harvest' };

/** A companion's expression explains today's records, never a forecast. */
export function flockCompanion(items = [], today, targetDays = 35, context = {}) {
  const eligible = items.filter(({ batch }) => batch && !batch.deleted_at && batch.start_date <= today);
  const selected = eligible.find(({ batch }) => batch.batch_id === context.selectedBatchId)
    || [...eligible].sort((a, b) => b.batch.start_date.localeCompare(a.batch.start_date))[0];
  const target = Math.max(1, Number(targetDays) || 35);
  const age = selected ? daysBetween(selected.batch.start_date, today) : 0;
  const stage = age < target / 3 ? 'chick' : age < target ? 'growing' : 'ready';
  const deaths = eligible.flatMap(item => filterActive(item.mortality || []));
  const count = deaths.filter(d => d.entry_date === today).reduce((sum, d) => sum + (Number(d.count) || 0), 0);
  const weekStart = addDays(today, -7);
  const average = deaths.filter(d => d.entry_date >= weekStart && d.entry_date < today)
    .reduce((sum, d) => sum + (Number(d.count) || 0), 0) / 7;
  const hasLimit = context.dailyDeathLimit != null && context.dailyDeathLimit !== '';
  const spike = (hasLimit && count > Number(context.dailyDeathLimit)) || (count >= 3 && count > average * 2);
  const loss = Number(context.dailyNetCentavos || 0) < 0;
  const total = context.tasks?.total || 0;
  const remaining = Math.max(0, total - (context.tasks?.done || 0));
  const complete = total > 0 && remaining === 0;
  const mortalityAlert = eligible.some(i => {
    const deaths = filterActive(i.mortality || []).reduce((s,m)=>s+(Number(m.count)||0),0);
    const limit = i.batch.mortality_threshold_pct;
    return limit != null && i.batch.initial_chick_count > 0 && deaths / i.batch.initial_chick_count * 100 > Number(limit);
  });
  const urgent = mortalityAlert || spike || Number(context.urgentCount || 0) >= 3;
  const overdue = Number(context.tasks?.overdue || 0) > 0;
  const monthLoss = context.role !== 'staff' && Number(context.monthNetCentavos ?? context.dailyNetCentavos ?? 0) < 0;
  const mood = urgent ? 'alerted' : overdue ? 'annoyed' : monthLoss ? 'sad' : complete ? 'happy' : 'sleepy';
  const reason = urgent ? (mortalityAlert ? 'A batch is above its mortality limit. Check the flock and its latest records.' : `${count.toLocaleString()} deaths today or urgent alerts need your attention.`)
    : overdue ? `${context.tasks.overdue} overdue tasks. Let’s catch up on today’s care.`
    : monthLoss ? 'Recorded costs are above sales this month. Check your recorded P&L.'
    : complete ? 'All today’s tasks are done. Your flock is in good hands.'
    : !selected ? 'A new beginning. Add a batch to meet your flock.'
    : remaining ? `${remaining} tasks are coming up. A little care, one step at a time.`
    : 'Nothing due and no critical alerts. A quiet moment for your flock.';

  return { batch: selected?.batch || null, age, stage, mood, sad: mood === 'sad', reason,
    dailyDeaths: count, deathSpike: spike, loss, remaining, complete };
}

export function userDisplayName(user) {
  return user?.user_metadata?.full_name || user?.name || user?.email?.split('@')[0]?.replace(/[._]/g, ' ') || 'there';
}
