import { describe, it, expect } from 'vitest';
import { buildPnlLedger, pnlForMonth, batchPerformanceThrough, monthDates, shiftMonth } from '../src/services/pnlCalendar.js';
const item = (id, cost=100) => ({batch:{batch_id:id,batch_name:id,start_date:'2026-02-01',initial_chick_count:10,chick_cost:cost},sales:[],allocations:[],mortality:[]});
describe('daily recorded P&L', () => {
  it('books chicks on start, sales on sale date and split costs on source date without doubling farm expense', () => {
    const a=item('a'),b=item('b',50);
    a.allocations=[{expense_id:'e',feed_centavos:601,other_centavos:101}];
    b.allocations=[{expense_id:'e',feed_centavos:399,other_centavos:99}];
    a.sales=[{sale_date:'2026-02-03',total_amount:100.15}];
    const l=buildPnlLedger([a,b],[{expense_id:'e',entry_date:'2026-02-02'}]);
    expect(l.days.get('2026-02-01').cost).toBe(15000);
    expect(l.days.get('2026-02-02').cost).toBe(1200);
    expect(l.days.get('2026-02-03').net).toBe(10015);
    expect(pnlForMonth(l,'2026-02')).toEqual({revenue:10015,cost:16200,net:-6185,days:3});
  });
  it('excludes voided sources, records and batches, and ignores orphaned allocations', () => {
    const a=item('a',0),b=item('b'); b.batch.deleted_at='x';
    a.sales=[{sale_date:'2026-02-02',total_amount:500,deleted_at:'x'}];
    a.allocations=[{expense_id:'void',feed_centavos:100},{expense_id:'missing',feed_centavos:100}];
    expect(buildPnlLedger([a,b],[{expense_id:'void',entry_date:'2026-02-02',deleted_at:'x'}]).days.size).toBe(0);
  });
  it('returns cumulative batch performance only through selected date', () => {
    const a=item('a'); a.sales=[{sale_date:'2026-02-03',total_amount:400,quantity_sold:3}]; a.mortality=[{entry_date:'2026-02-02',count:1}];
    const l=buildPnlLedger([a]);
    expect(batchPerformanceThrough(l,a,'2026-02-02')).toMatchObject({revenue:0,cost:10000,net:-10000,live:9});
    expect(batchPerformanceThrough(l,a,'2026-02-03')).toMatchObject({revenue:40000,net:30000,live:6});
  });
  it('handles empty months, leap years, Monday alignment and year boundaries', () => {
    expect(pnlForMonth(buildPnlLedger(),'2026-01').net).toBe(0);
    expect(monthDates('2024-02').filter(Boolean)).toHaveLength(29);
    expect(monthDates('2026-02').slice(0,6)).toEqual(Array(6).fill(null));
    expect(shiftMonth('2026-12',1)).toBe('2027-01');
    expect(shiftMonth('2026-01',-1)).toBe('2025-12');
  });
});
