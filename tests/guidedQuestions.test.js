import { describe, it, expect } from 'vitest';
import {
  addDays,
  daysBetween,
  kgPerHead,
  breakEvenPrice,
  profitBreakdown,
  buildGuidedQuestions,
  cardsForRole
} from '../src/services/guidedQuestions.js';
import { buildDailyTasks } from '../src/services/dailyTasks.js';
import { can, normalizeRole, PERMISSION_GROUPS } from '../src/services/permissions.js';

const TODAY = '2026-11-07';

function openBatch({ id = 'b1', name = 'Batch A', start = '2026-10-01', chicks = 1000, chickCost = 50000, deaths = [], feed = [], sales = [], allocations = [] } = {}) {
  return {
    batch: { batch_id: id, batch_name: name, start_date: start, initial_chick_count: chicks, chick_cost: chickCost, status: 'Open' },
    mortality: deaths.map(([date, count], i) => ({ mortality_id: `${id}-m${i}`, batch_id: id, entry_date: date, count })),
    feed: feed.map(([date, g], i) => ({ feed_log_id: `${id}-f${i}`, batch_id: id, entry_date: date, quantity_g: g })),
    sales: sales.map(([date, qty, kg, price], i) => ({ sale_id: `${id}-s${i}`, batch_id: id, sale_date: date, quantity_sold: qty, weight_kg: kg, price_per_kg: price, total_amount: kg * price })),
    allocations
  };
}

describe('small helpers', () => {
  it('adds and counts days across months', () => {
    expect(addDays('2026-10-31', 1)).toBe('2026-11-01');
    expect(daysBetween('2026-10-01', '2026-11-07')).toBe(37);
  });

  it('kg per head ignores deleted sales and returns null with no sales', () => {
    expect(kgPerHead([])).toBeNull();
    expect(kgPerHead([{ quantity_sold: 10, weight_kg: 20 }, { quantity_sold: 10, weight_kg: 99, deleted_at: 'x' }])).toBe(2);
  });
});

describe('breakEvenPrice', () => {
  it('divides what is still unrecovered by the kilograms expected from the live birds', () => {
    const r = breakEvenPrice({ totalCost: 150000, revenue: 50000, liveBirds: 500, avgKgPerHead: 2 });
    expect(r.unrecovered).toBe(100000);
    expect(r.expectedKg).toBe(1000);
    expect(r.price).toBe(100);
  });

  it('is zero once sales cover the cost, and unknown with no weight to go on', () => {
    expect(breakEvenPrice({ totalCost: 100, revenue: 120, liveBirds: 5, avgKgPerHead: 2 }).price).toBe(0);
    expect(breakEvenPrice({ totalCost: 100, revenue: 20, liveBirds: 5, avgKgPerHead: null }).price).toBeNull();
  });
});

describe('profitBreakdown', () => {
  it('splits the profit change into price, weight and cost parts that add up exactly', () => {
    const prev = { revenue: 300000, kgSold: 3000, totalCost: 220000, netProfit: 80000 };
    const curr = { revenue: 266000, kgSold: 2800, totalCost: 246000, netProfit: 20000 };
    const b = profitBreakdown(prev, curr);
    expect(b.change).toBe(-60000);
    expect(b.price).toBeCloseTo(-14000, 6); // (95 − 100) × 2800
    expect(b.weight).toBeCloseTo(-20000, 6); // 100 × (2800 − 3000)
    expect(b.cost).toBe(-26000);
    expect(b.price + b.weight + b.cost).toBeCloseTo(b.change, 6);
  });
});

describe('buildDailyTasks', () => {
  const batch = openBatch({ feed: [[TODAY, 5000]], deaths: [] });

  it('makes feed and death tasks per open batch plus one receipts task, ticked from the records', () => {
    const r = buildDailyTasks({ openBatchesData: [batch], expenses: [], today: TODAY, now: '09:00' });
    expect(r.tasks.map((t) => t.type)).toEqual(['feed', 'deaths', 'receipts']);
    expect(r.tasks[0].done).toBe(true);
    expect(r.tasks[1].done).toBe(false);
    expect(r.done).toBe(1);
    expect(r.overdue).toBe(0);
  });

  it('counts a zero-death entry and a "no receipts" mark as done, and marks the rest overdue after the due time', () => {
    const withZero = openBatch({ deaths: [[TODAY, 0]] });
    const r = buildDailyTasks({ openBatchesData: [withZero], today: TODAY, now: '19:00', marks: { [`no-receipts:${TODAY}`]: true } });
    expect(r.tasks.find((t) => t.type === 'deaths')).toMatchObject({ done: true, detail: 'No deaths today' });
    expect(r.tasks.find((t) => t.type === 'receipts').done).toBe(true);
    expect(r.tasks.find((t) => t.type === 'feed').overdue).toBe(true);
  });

  it('has no tasks when no batch is open', () => {
    expect(buildDailyTasks({ openBatchesData: [], today: TODAY }).total).toBe(0);
  });
});

describe('buildGuidedQuestions', () => {
  const closedA = { ...openBatch({ id: 'c1', name: 'Old 1', start: '2026-05-01', sales: [['2026-06-05', 1000, 2000, 100]] }), allocations: [] };
  const closedB = { ...openBatch({ id: 'c2', name: 'Old 2', start: '2026-07-01', sales: [['2026-08-05', 1000, 1800, 95]] }), allocations: [] };
  closedA.batch = { ...closedA.batch, status: 'Closed', end_date: '2026-06-05' };
  closedB.batch = { ...closedB.batch, status: 'Closed', end_date: '2026-08-05' };

  it('answers the money, price, hold and breakdown questions from the records', () => {
    const open = openBatch({
      start: '2026-09-01', // 67 days old: past a 35-day target
      deaths: [['2026-10-10', 100]],
      sales: [['2026-11-01', 100, 200, 90]],
      allocations: [{ expense_id: 'e1', batch_id: 'b1', feed_centavos: 700000, other_centavos: 0 }]
    });
    const expenses = [{ expense_id: 'e1', entry_date: '2026-11-05' }];
    const cards = buildGuidedQuestions({ openBatchesData: [open], closedBatchesWithData: [closedA, closedB], expenses, today: TODAY, settings: { targetHarvestDays: 35 } });
    const ids = cards.map((c) => c.id);
    expect(ids).toEqual(expect.arrayContaining(['money:b1', 'price:b1', 'hold:b1', 'breakdown']));

    const money = cards.find((c) => c.id === 'money:b1');
    // cost 50,000 chicks + 7,000 feed = 57,000; sales 18,000 → 39,000 to recover over 800 live birds
    expect(money.value).toBe('−₱39,000.00');
    expect(money.meaning).toContain('₱48.75 per live bird');

    const price = cards.find((c) => c.id === 'price:b1');
    // 800 birds × 2 kg/head = 1,600 kg → 39,000 / 1,600 = 24.375
    expect(price.value).toBe('₱24.38/kg');
    expect(price.tone).toBe('info'); // last sale at 90/kg is above break-even

    const hold = cards.find((c) => c.id === 'hold:b1');
    expect(hold.tone).toBe('bad'); // 32 days past target
    expect(hold.value).toBe('₱1.25/bird/day'); // 7,000 over 7 days / 800 birds

    const breakdown = cards.find((c) => c.id === 'breakdown');
    expect(breakdown.question).toBe('Why did Old 2 earn less than Old 1?');
  });

  it('raises a death-spike card only when today is well above the 7-day average', () => {
    const days = Array.from({ length: 7 }, (_, i) => [addDays(TODAY, -(i + 1)), 10]);
    const spike = openBatch({ start: '2026-10-20', deaths: [...days, [TODAY, 40]] });
    const calm = openBatch({ id: 'b2', start: '2026-10-20', deaths: [...days, [TODAY, 15]] });
    const cards = buildGuidedQuestions({ openBatchesData: [spike, calm], today: TODAY });
    expect(cards.find((c) => c.id === 'deaths:b1')).toMatchObject({ tone: 'bad', value: '40 deaths' });
    expect(cards.find((c) => c.id === 'deaths:b2')).toBeUndefined();
    expect(cards[0].tone).toBe('bad'); // most urgent first
  });

  it('shows staff only the cards without money', () => {
    const tasks = buildDailyTasks({ openBatchesData: [openBatch()], today: TODAY });
    const cards = buildGuidedQuestions({ openBatchesData: [openBatch()], today: TODAY, tasks });
    const staff = cardsForRole(cards, 'staff');
    expect(staff.map((c) => c.id)).toEqual(['tasks']);
  });
});

describe('permissions', () => {
  it('follows the role table: always, never, and optional when granted', () => {
    expect(can('owner', 'pay.run')).toBe(true);
    expect(can('admin', 'pay.run')).toBe(false);
    expect(can('admin', 'batch.reopen')).toBe(true);
    expect(can('staff', 'sale.record')).toBe(false);
    expect(can('staff', 'sale.record', ['sale.record'])).toBe(true);
    expect(can('staff', 'report.view', ['report.view'])).toBe(false);
  });

  it('treats an unknown role as owner only for the preview, and every permission names all three roles', () => {
    expect(normalizeRole('nope')).toBe('owner');
    for (const p of PERMISSION_GROUPS.flatMap((g) => g.items)) {
      for (const r of ['owner', 'admin', 'staff']) expect(['always', 'never', 'optional']).toContain(p[r]);
    }
  });
});
