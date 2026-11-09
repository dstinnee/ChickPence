/**
 * guidedQuestions.js
 * Home's "daily insights" row: questions the owner would ask, each answered
 * from the farm's own records (thesis audit, sections 9, 11 and 13).
 * Rule-based decision support: every number comes from code, no AI.
 *
 * Pure: give it the data, the day and the settings; it returns cards.
 */

import { calcBatchMetrics, liveHeadCount } from './allocationEngine.js';
import { filterActive, formatPeso, formatNumber } from './calculations.js';

const TONE_ORDER = { bad: 0, warn: 1, info: 2, ok: 3 };

export function addDays(date, n) {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export function daysBetween(from, to) {
  return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86400000);
}

const clampPct = (v) => Math.max(0, Math.min(100, Math.round(v)));
const sum = (rows, key) => rows.reduce((s, r) => s + (Number(r[key]) || 0), 0);

/** Kilograms sold per head, from a list of sales (null when nothing was sold). */
export function kgPerHead(sales = []) {
  const active = filterActive(sales);
  const heads = sum(active, 'quantity_sold');
  return heads > 0 ? sum(active, 'weight_kg') / heads : null;
}

/**
 * Break-even price per kg for selling the remaining birds now.
 * unrecovered = cost to date − sales to date; expected kg = live birds × kg per head.
 */
export function breakEvenPrice({ totalCost, revenue, liveBirds, avgKgPerHead }) {
  const unrecovered = totalCost - revenue;
  const expectedKg = liveBirds * (avgKgPerHead || 0);
  if (unrecovered <= 0) return { price: 0, unrecovered, expectedKg };
  if (expectedKg <= 0) return { price: null, unrecovered, expectedKg };
  return { price: unrecovered / expectedKg, unrecovered, expectedKg };
}

/**
 * Split the change in net profit between two batches into price, weight sold and cost.
 * The three parts add up exactly to the change:
 *   price  = (p1 − p0) × kg1
 *   weight = p0 × (kg1 − kg0)
 *   cost   = −(cost1 − cost0)
 */
export function profitBreakdown(prev, curr) {
  const p0 = prev.kgSold > 0 ? prev.revenue / prev.kgSold : 0;
  const p1 = curr.kgSold > 0 ? curr.revenue / curr.kgSold : 0;
  const price = (p1 - p0) * curr.kgSold;
  const weight = p0 * (curr.kgSold - prev.kgSold);
  const cost = -(curr.totalCost - prev.totalCost);
  return { change: curr.netProfit - prev.netProfit, price, weight, cost, p0, p1 };
}

/** Allocated cost (feed + other) for one batch on dates in [from, to]. */
function allocatedCostBetween(allocations, expensesById, from, to) {
  let centavos = 0;
  for (const a of filterActive(allocations)) {
    const date = expensesById.get(a.expense_id)?.entry_date;
    if (date && date >= from && date <= to) centavos += (Number(a.feed_centavos) || 0) + (Number(a.other_centavos) || 0);
  }
  return centavos / 100;
}

function deathsOn(mortality, date) {
  return filterActive(mortality).filter((m) => m.entry_date === date).reduce((s, m) => s + (Number(m.count) || 0), 0);
}

/**
 * @param {object} o
 * @param {object[]} o.openBatchesData        [{ batch, feed, mortality, sales, allocations }]
 * @param {object[]} o.closedBatchesWithData  same shape
 * @param {object[]} o.expenses
 * @param {string}   o.today                  YYYY-MM-DD
 * @param {object}   [o.settings]             { targetHarvestDays, dailyDeathLimit }
 * @param {object}   [o.tasks]                result of buildDailyTasks
 * @returns {object[]} cards, most urgent first
 */
export function buildGuidedQuestions({ openBatchesData = [], closedBatchesWithData = [], expenses = [], today, settings = {}, tasks = null }) {
  const cards = [];
  const target = Number(settings.targetHarvestDays) || 35;
  const limit = settings.dailyDeathLimit == null || settings.dailyDeathLimit === '' ? null : Number(settings.dailyDeathLimit);
  const expensesById = new Map(filterActive(expenses).map((e) => [e.expense_id, e]));
  const tomorrow = addDays(today, 1);

  const closedSales = closedBatchesWithData.flatMap((c) => c.sales || []);
  const farmKgPerHead = kgPerHead(closedSales);
  const closedActive = filterActive(closedSales);
  const farmPrice = sum(closedActive, 'weight_kg') > 0 ? sum(closedActive, 'total_amount') / sum(closedActive, 'weight_kg') : null;

  for (const item of openBatchesData) {
    const { batch, feed = [], mortality = [], sales = [], allocations = [] } = item;
    if (!batch || batch.start_date > today) continue;
    const name = batch.batch_name;
    const m = calcBatchMetrics(batch, allocations, sales, mortality, feed);
    const live = liveHeadCount(batch, mortality, sales, tomorrow);
    const unrecovered = m.totalCost - m.revenue;
    const age = daysBetween(batch.start_date, today);

    // 1. Am I losing money on this batch?
    const recovered = m.totalCost > 0 ? (m.revenue / m.totalCost) * 100 : 100;
    cards.push({
      id: `money:${batch.batch_id}`,
      icon: 'coins',
      audience: 'money',
      question: `Am I losing money on ${name}?`,
      value: unrecovered > 0 ? `−${formatPeso(unrecovered)}` : `+${formatPeso(-unrecovered)}`,
      meaning: unrecovered > 0
        ? (live > 0 ? `${formatPeso(unrecovered / live)} per live bird still to recover` : 'No birds left to sell')
        : 'Sales already cover every cost so far',
      bar: { pct: clampPct(recovered), label: `${clampPct(recovered)}% of cost recovered` },
      tone: unrecovered <= 0 ? 'ok' : live === 0 ? 'bad' : 'info',
      answer: {
        sentence: unrecovered > 0
          ? `Not yet a loss, but not a profit either: sales so far cover ${clampPct(recovered)}% of what ${name} has cost. The ${live.toLocaleString()} birds still in the coop must bring in ${formatPeso(unrecovered)} more to break even.`
          : `${name} is already earning: sales so far are ${formatPeso(-unrecovered)} more than everything it has cost.`,
        numbers: [
          ['Cost to date', formatPeso(m.totalCost)],
          ['Sales to date', formatPeso(m.revenue)],
          ['Live, unsold birds', live.toLocaleString()],
          ['Still to recover per bird', live > 0 && unrecovered > 0 ? formatPeso(unrecovered / live) : '—']
        ],
        action: unrecovered > 0 ? 'Check "What price do I need?" before agreeing to the next buyer\'s price.' : 'Keep recording feed and deaths so the profit stays accurate.',
        batchId: batch.batch_id,
        view: 'batches'
      }
    });

    // 2. What price do I need today?
    const perHead = kgPerHead(sales) ?? farmKgPerHead;
    const be = breakEvenPrice({ totalCost: m.totalCost, revenue: m.revenue, liveBirds: live, avgKgPerHead: perHead });
    if (live > 0 && be.unrecovered > 0 && be.price != null) {
      const lastSale = [...filterActive(sales)].sort((a, b) => (a.sale_date < b.sale_date ? 1 : -1))[0];
      const refPrice = lastSale ? Number(lastSale.price_per_kg) : farmPrice;
      const refLabel = lastSale ? 'last sale price' : 'average price of past batches';
      const below = refPrice != null && refPrice < be.price;
      cards.push({
        id: `price:${batch.batch_id}`,
        icon: 'tag',
        audience: 'money',
        question: `What price do I need for ${name}?`,
        value: `${formatPeso(be.price)}/kg`,
        meaning: `Break-even if about ${formatNumber(be.expectedKg, 0)} kg are sold now`,
        bar: refPrice != null
          ? { pct: clampPct((refPrice / be.price) * 100), label: `${refLabel}: ${formatPeso(refPrice)}/kg` }
          : { pct: 0, label: 'No sale price yet to compare' },
        tone: below ? 'bad' : 'info',
        answer: {
          sentence: below
            ? `At the ${refLabel} of ${formatPeso(refPrice)}/kg, selling the remaining birds now would not cover ${name}'s costs. You need at least ${formatPeso(be.price)}/kg.`
            : `Selling the remaining birds at ${formatPeso(be.price)}/kg or more covers everything ${name} has cost so far.`,
        numbers: [
            ['Still to recover', formatPeso(be.unrecovered)],
            ['Live birds', live.toLocaleString()],
            ['Expected weight per bird', `${formatNumber(perHead, 2)} kg`],
            ['Expected kg to sell', `${formatNumber(be.expectedKg, 0)} kg`]
          ],
          action: 'Use Sales & Buyers → Price check to test the buyer\'s offer and the exact weight.',
          batchId: batch.batch_id,
          view: 'price-check'
        }
      });
    }

    // 3. Sell or keep the remaining birds?
    if (live > 0 && age >= target) {
      const lastWeek = allocatedCostBetween(allocations, expensesById, addDays(today, -6), today);
      const perBirdDay = lastWeek / 7 / live;
      const over = age - target;
      cards.push({
        id: `hold:${batch.batch_id}`,
        icon: 'clock',
        audience: 'money',
        question: `Sell or keep the birds in ${name}?`,
        value: `${formatPeso(perBirdDay)}/bird/day`,
        meaning: `What each extra day costs · day ${age} of ${target}`,
        bar: { pct: clampPct((age / (target + 14)) * 100), label: over === 0 ? 'Reached target age today' : `${over} day${over === 1 ? '' : 's'} past target age` },
        tone: over >= 7 ? 'bad' : 'warn',
        answer: {
          sentence: `${name} is ${over === 0 ? 'at' : `${over} day${over === 1 ? '' : 's'} past`} its target harvest age of ${target} days. Keeping the ${live.toLocaleString()} remaining birds costs about ${formatPeso(perBirdDay * live)} a day, or ${formatPeso(perBirdDay)} per bird.`,
          numbers: [
            ['Age today', `${age} days`],
            ['Target harvest age', `${target} days`],
            ['Shared costs, last 7 days', formatPeso(lastWeek)],
            ['Cost per bird per day', formatPeso(perBirdDay)]
          ],
          action: 'Keep them only if the extra weight they gain each day is worth more than this cost.',
          batchId: batch.batch_id,
          view: 'batches'
        }
      });
    }

    // 4. Why so many deaths today?
    const todayDeaths = deathsOn(mortality, today);
    let prev7 = 0;
    for (let i = 1; i <= 7; i++) prev7 += deathsOn(mortality, addDays(today, -i));
    const avg7 = prev7 / 7;
    const spikeByAvg = avg7 > 0 && todayDeaths > 2 * avg7;
    const spikeByLimit = limit != null && todayDeaths > limit;
    if (todayDeaths > 0 && (spikeByAvg || spikeByLimit)) {
      cards.push({
        id: `deaths:${batch.batch_id}`,
        icon: 'heart',
        audience: 'all',
        question: `Why so many deaths in ${name} today?`,
        value: `${todayDeaths.toLocaleString()} deaths`,
        meaning: avg7 > 0 ? `${formatNumber(todayDeaths / avg7, 1)} × the 7-day average` : `Above the daily limit of ${limit}`,
        bar: { pct: clampPct(limit ? (todayDeaths / limit) * 100 : (todayDeaths / (2 * avg7)) * 100), label: limit ? `Daily limit: ${limit}` : `7-day average: ${formatNumber(avg7, 1)}` },
        tone: 'bad',
        answer: {
          sentence: `${name} lost ${todayDeaths.toLocaleString()} birds today, against an average of ${formatNumber(avg7, 1)} a day over the past week. A sudden rise usually points to disease, heat, water or feed problems.`,
          numbers: [
            ['Deaths today', todayDeaths.toLocaleString()],
            ['Average, last 7 days', formatNumber(avg7, 1)],
            ['Daily limit', limit != null ? String(limit) : 'Not set'],
            ['Total mortality', `${formatNumber(m.mortalityRate, 1)}%`]
          ],
          action: 'Check the shed today: water lines, temperature, feed, and signs of illness. Call the vet if it continues tomorrow.',
          batchId: batch.batch_id,
          view: 'batches'
        }
      });
    }
  }

  // 5. Why did the last batch earn less (or more)?
  const closed = closedBatchesWithData
    .filter((c) => c.batch && !c.batch.deleted_at)
    .map((c) => ({ batch: c.batch, m: calcBatchMetrics(c.batch, c.allocations || [], c.sales || [], c.mortality || [], c.feed || []) }))
    .sort((a, b) => ((a.batch.end_date || a.batch.start_date) < (b.batch.end_date || b.batch.start_date) ? -1 : 1));
  if (closed.length >= 2) {
    const prev = closed[closed.length - 2];
    const curr = closed[closed.length - 1];
    const br = profitBreakdown(prev.m, curr.m);
    const parts = [['selling price', br.price], ['weight sold', br.weight], ['costs', br.cost]];
    const main = [...parts].sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))[0];
    const less = br.change < 0;
    const signed = (v) => `${v >= 0 ? '+' : '−'}${formatPeso(Math.abs(v))}`;
    const total = Math.abs(br.price) + Math.abs(br.weight) + Math.abs(br.cost) || 1;
    cards.push({
      id: 'breakdown',
      icon: 'chart',
      audience: 'money',
      question: `Why did ${curr.batch.batch_name} earn ${less ? 'less' : 'more'} than ${prev.batch.batch_name}?`,
      value: signed(br.change),
      meaning: `Mostly ${main[0]} (${signed(main[1])})`,
      bar: { pct: clampPct((Math.abs(main[1]) / total) * 100), label: `${main[0]}: ${clampPct((Math.abs(main[1]) / total) * 100)}% of the difference` },
      tone: less ? 'warn' : 'ok',
      answer: {
        sentence: `${curr.batch.batch_name} made ${formatPeso(Math.abs(br.change))} ${less ? 'less' : 'more'} than ${prev.batch.batch_name}. The biggest reason was ${main[0]}, not ${main[0] === 'selling price' ? 'weight or costs' : 'only the selling price'}.`,
        numbers: [
          ['Selling price effect', `${signed(br.price)} (${formatPeso(br.p0)} → ${formatPeso(br.p1)}/kg)`],
          ['Weight sold effect', `${signed(br.weight)} (${formatNumber(prev.m.kgSold, 0)} → ${formatNumber(curr.m.kgSold, 0)} kg)`],
          ['Cost effect', `${signed(br.cost)} (${formatPeso(prev.m.totalCost)} → ${formatPeso(curr.m.totalCost)})`],
          ['Change in net profit', signed(br.change)]
        ],
        action: main[0] === 'costs' ? 'Compare feed used and mortality between the two batches in Batches → Compare.' : main[0] === 'weight sold' ? 'Fewer or lighter birds were sold: check mortality and harvest age.' : 'The market price moved: track buyer prices in Sales & Buyers.',
        batchId: curr.batch.batch_id,
        view: 'summary'
      }
    });
  }

  // 6. Did everyone record today?
  if (tasks && tasks.total > 0) {
    const missing = tasks.tasks.filter((t) => !t.done);
    cards.push({
      id: 'tasks',
      icon: 'check',
      audience: 'all',
      question: 'Did everyone record today?',
      value: `${tasks.done} of ${tasks.total}`,
      meaning: missing.length ? `Not yet: ${missing[0].label}${missing.length > 1 ? ` +${missing.length - 1} more` : ''}` : 'All of today\'s records are in',
      bar: { pct: clampPct((tasks.done / tasks.total) * 100), label: `${tasks.done} of ${tasks.total} tasks done` },
      tone: tasks.overdue > 0 ? 'bad' : missing.length ? 'warn' : 'ok',
      answer: {
        sentence: missing.length
          ? `${missing.length} of today's ${tasks.total} records ${missing.length === 1 ? 'is' : 'are'} still missing${tasks.overdue ? `, and ${tasks.overdue} ${tasks.overdue === 1 ? 'is' : 'are'} past due` : ''}.`
          : 'Every daily record for today has been entered.',
        numbers: tasks.tasks.map((t) => [t.label, t.done ? (t.detail || 'Done') : t.overdue ? 'Overdue' : `Due ${t.due}`]),
        action: missing.length ? 'Open the to-do list below to record what is missing, or tap "No deaths today" / "No receipts today".' : 'Nothing to do.',
        batchId: null,
        view: 'todo'
      }
    });
  }

  return cards.sort((a, b) => TONE_ORDER[a.tone] - TONE_ORDER[b.tone]);
}

/** Cards a role may see: staff get only the non-money ones. */
export function cardsForRole(cards, role) {
  return role === 'staff' ? cards.filter((c) => c.audience !== 'money') : cards;
}
