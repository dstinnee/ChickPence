import { filterActive } from './calculations.js';

/** Date-based recorded P&L, in integer centavos. Chick purchase is booked on
 * batch start; shared expenses use their source date, never allocation order. */
export function buildPnlLedger(items = [], expenses = []) {
  const expenseMap = new Map(filterActive(expenses).map(e => [e.expense_id, e]));
  const days = new Map();
  const batches = items.filter(i => !i.batch.deleted_at);
  function add(date, item, revenue = 0, chicks = 0, feed = 0, other = 0) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) return;
    if (!days.has(date)) days.set(date, { date, revenue: 0, chicks: 0, feed: 0, other: 0, cost: 0, net: 0, batches: new Map() });
    const day = days.get(date), id = item.batch.batch_id;
    if (!day.batches.has(id)) day.batches.set(id, { id, name: item.batch.batch_name, revenue: 0, chicks: 0, feed: 0, other: 0, cost: 0, net: 0 });
    for (const row of [day, day.batches.get(id)]) {
      row.revenue += revenue; row.chicks += chicks; row.feed += feed; row.other += other;
      row.cost += chicks + feed + other; row.net = row.revenue - row.cost;
    }
  }
  for (const item of batches) {
    if (Number(item.batch.chick_cost)) add(item.batch.start_date, item, 0, Math.round(Number(item.batch.chick_cost) * 100));
    for (const sale of filterActive(item.sales || [])) add(sale.sale_date, item, Math.round((Number(sale.total_amount) || 0) * 100));
    for (const allocation of filterActive(item.allocations || [])) {
      const source = expenseMap.get(allocation.expense_id);
      if (source) add(source.entry_date, item, 0, 0, Number(allocation.feed_centavos) || 0, Number(allocation.other_centavos) || 0);
    }
  }
  return { days, batches };
}

export function pnlForMonth(ledger, month) {
  return [...ledger.days.values()].filter(d => d.date.startsWith(month)).reduce((s, d) => ({ revenue: s.revenue + d.revenue, cost: s.cost + d.cost, net: s.net + d.net, days: s.days + 1 }), {revenue:0,cost:0,net:0,days:0});
}

export function batchPerformanceThrough(ledger, item, date) {
  const id = item.batch.batch_id;
  const result = { revenue: 0, cost: 0, net: 0, mortality: 0, sold: 0, live: 0 };
  for (const day of ledger.days.values()) {
    const row = day.date <= date && day.batches.get(id);
    if (row) { result.revenue += row.revenue; result.cost += row.cost; }
  }
  result.net = result.revenue - result.cost;
  result.mortality = filterActive(item.mortality || []).filter(x => x.entry_date <= date).reduce((s,x) => s + (Number(x.count)||0), 0);
  result.sold = filterActive(item.sales || []).filter(x => x.sale_date <= date).reduce((s,x) => s + (Number(x.quantity_sold)||0), 0);
  result.live = item.batch.start_date > date ? 0 : Math.max(0, Number(item.batch.initial_chick_count) - result.mortality - result.sold);
  return result;
}

export function monthDates(month) {
  const [year, m] = month.split('-').map(Number);
  const offset = (new Date(Date.UTC(year, m - 1, 1)).getUTCDay() + 6) % 7;
  const count = new Date(Date.UTC(year, m, 0)).getUTCDate();
  return [...Array(offset).fill(null), ...Array.from({length:count},(_,i) => `${month}-${String(i+1).padStart(2,'0')}`)];
}
export function shiftMonth(month, delta) {
  const [year,m] = month.split('-').map(Number);
  return new Date(Date.UTC(year, m-1+delta, 1)).toISOString().slice(0,7);
}
