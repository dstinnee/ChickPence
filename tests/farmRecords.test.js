import { describe,it,expect } from 'vitest';
import { buildFarmReport } from '../src/services/farmReports.js';
import { newReviewRequest,reviewRequest,filterReviewRequests } from '../src/services/reviewRequests.js';
import { filterLogRows } from '../src/ui/logbookView.js';
import { csvCell,farmPagination } from '../src/ui/farmTable.js';
import { renderReports } from '../src/ui/reportsView.js';
import { renderApprovals } from '../src/ui/approvalsView.js';
const item={batch:{batch_id:'b1',batch_name:'Batch A',status:'Open',start_date:'2026-11-01',initial_chick_count:100,chick_cost:5000,mortality_threshold_pct:2},feed:[{entry_date:'2026-11-02',quantity_g:12500},{entry_date:'2026-11-08',quantity_g:5000},{entry_date:'2026-11-08',quantity_g:99000,deleted_at:'x'}],mortality:[{entry_date:'2026-11-02',count:2},{entry_date:'2026-11-08',count:3}],sales:[{sale_date:'2026-11-08',buyer_name:'Nena',quantity_sold:10,weight_kg:20,total_amount:2400}],allocations:[{expense_id:'e1',batch_id:'b1',feed_centavos:30000,other_centavos:10000}]};
const expenses=[{expense_id:'e1',entry_date:'2026-11-08'}];
describe('Farm report calculations',()=>{
 it('calculates inclusive end-of-day bird balance from saved deaths and sales',()=>{
  const row=buildFarmReport([item],expenses,'flock',{to:'2026-11-08'})[0];
  expect(row).toMatchObject({initial:100,totalDeaths:5,sold:10,live:85,age:7});
 });
 it('separates period feed/deaths from cumulative mortality thresholds',()=>{
  const row=buildFarmReport([item],expenses,'health',{from:'2026-11-08',to:'2026-11-08'})[0];
  expect(row).toMatchObject({feed:5,deaths:3,mortalityRate:5,warning:true});
 });
 it('uses the same integer-centavo ledger for date-filtered recorded P&L',()=>{
  const all=buildFarmReport([item],expenses,'pnl',{to:'2026-11-08'})[0];
  expect(all).toMatchObject({revenue:240000,cost:540000,net:-300000,final:false});
  const day=buildFarmReport([item],expenses,'pnl',{from:'2026-11-08',to:'2026-11-08'})[0];
  expect(day).toMatchObject({revenue:240000,cost:40000,net:200000});
 });
 it('groups actual buyer sales and excludes future/voided transactions',()=>{
  const input={...item,sales:[...item.sales,{sale_date:'2026-11-09',buyer_name:'Nena',quantity_sold:50,weight_kg:100,total_amount:12000},{...item.sales[0],deleted_at:'x'}]};
  expect(buildFarmReport([input],expenses,'sales',{to:'2026-11-08'})).toEqual([expect.objectContaining({buyer:'Nena',heads:10,kg:20,revenue:240000,price:120,sales:1})]);
 });
 it('filters batch status/name and excludes batches not yet placed',()=>{
  expect(buildFarmReport([item],expenses,'flock',{q:'other'})).toHaveLength(0);
  expect(buildFarmReport([item],expenses,'flock',{status:'Closed'})).toHaveLength(0);
  expect(buildFarmReport([item],expenses,'flock',{to:'2026-10-31'})).toHaveLength(0);
 });
 it('renders real empty states and preserves the report basis',()=>{
  expect(renderReports([],[],{tab:'pnl'})).toContain('No farm records match');
  expect(renderReports([item],expenses,{tab:'pnl'})).toContain('Provisional');
 });
});
describe('Farm review requests',()=>{
 const user={id:'staff1',name:'Ana'},row={id:'f1',batchId:'b1',batch:'Batch A',type:'Feed',date:'2026-11-08',change:'20 kg'};
 const create=()=>newReviewRequest({row,proposed:'25 kg',reason:'Receipt checked',user,now:'2026-11-08T01:00:00Z'});
 it('keeps original/proposed values, reason and requester without changing the farm entry',()=>{
  const request=create();expect(request).toMatchObject({before:'20 kg',proposed:'25 kg',requestedBy:'staff1',status:'pending'});expect(row.change).toBe('20 kg');
 });
 it('requires a meaningful correction and reason',()=>{
  expect(()=>newReviewRequest({row,proposed:'',reason:'x',user})).toThrow('Describe');
  expect(()=>newReviewRequest({row,proposed:'25 kg',reason:'',user})).toThrow('reason');
 });
 it('forbids staff review, self-review, and repeated review',()=>{
  const request=create();
  expect(()=>reviewRequest(request,{decision:'approved',note:'Okay',role:'staff',user:{id:'manager'}})).toThrow('owner or admin');
  expect(()=>reviewRequest(request,{decision:'approved',note:'Okay',role:'owner',user})).toThrow('own request');
  const approved=reviewRequest(request,{decision:'approved',note:'Receipt verified',role:'admin',user:{id:'manager',name:'Mario'}});
  expect(approved.status).toBe('approved');expect(approved.before).toBe('20 kg');
  expect(()=>reviewRequest(approved,{decision:'rejected',note:'No',role:'owner',user:{id:'other'}})).toThrow('already');
 });
 it('filters the review queue and renders a farm-specific pending state',()=>{
  expect(filterReviewRequests([create()],{type:'Deaths'})).toHaveLength(0);
  const html=renderApprovals([],[],{},user,'admin');
  expect(html).toContain('Nothing waiting for approval');expect(html).toContain('Device-only preview');
 });
});
describe('Farm table controls',()=>{
 it('searches farm entries and guards formula-like CSV text',()=>{
  expect(filterLogRows([{id:'a',batch:'Batch A',type:'Feed',date:'2026-11-08',change:'25 kg'}],{q:'25 kg'})).toHaveLength(1);
  expect(csvCell('=SUM(A1)')).toBe("'=SUM(A1)");expect(csvCell(-5)).toBe('-5');
 });
 it('paginates bounded result ranges, including empty tables',()=>{
  expect(farmPagination(28,2,10)).toContain('11–20 of 28');expect(farmPagination(0,5,10)).toBe('');
  expect(farmPagination(8,1,10)).toBe('');
 });
});
