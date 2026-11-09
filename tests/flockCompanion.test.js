import { describe, it, expect } from 'vitest';
import { flockCompanion, userDisplayName } from '../src/services/flockCompanion.js';
import { renderCompanion, renderWelcome } from '../src/ui/flockCompanion.js';
const TODAY = '2026-11-08';
const item = (start = '2026-11-06', id = 'baby') => ({batch:{batch_id:id,batch_name:id,start_date:start}, mortality:[]});
describe('flock companion from farm records', () => {
  it('uses chick, pullet and harvest stages, including the target day boundary', () => {
    expect(flockCompanion([item()],TODAY,35).stage).toBe('chick');
    expect(flockCompanion([item('2026-10-20')],TODAY,35).stage).toBe('growing');
    expect(flockCompanion([item('2026-10-04')],TODAY,35).stage).toBe('ready');
  });
  it('selects the requested flock and excludes future or voided batches', () => {
    const old=item('2026-09-01','old');
    const deleted={batch:{...item().batch,deleted_at:'x'}};
    expect(flockCompanion([old,item(),item('2026-11-09','future'),deleted],TODAY,35,{selectedBatchId:'old'}).batch.batch_id).toBe('old');
    expect(flockCompanion([old,item('2026-11-09','future'),deleted],TODAY).batch.batch_id).toBe('old');
  });
  it('is happy only after all daily tasks are done and no daily loss is recorded', () => {
    expect(flockCompanion([item()],TODAY,35,{tasks:{total:5,done:5},dailyNetCentavos:0}).mood).toBe('happy');
    expect(flockCompanion([item()],TODAY,35,{tasks:{total:5,done:5},dailyNetCentavos:-1}).mood).toBe('sad');
  });
  it('is annoyed by overdue tasks and sleepy while upcoming tasks are not due', () => {
    expect(flockCompanion([item()],TODAY,35,{tasks:{total:5,done:2,overdue:1}}).mood).toBe('annoyed');
    expect(flockCompanion([item()],TODAY,35,{tasks:{total:5,done:4}}).mood).toBe('sleepy');
  });
  it('prioritizes a death spike over outstanding tasks and ignores voided deaths', () => {
    const batch={...item(),mortality:[{entry_date:TODAY,count:10},{entry_date:TODAY,count:99,deleted_at:'x'}]};
    expect(flockCompanion([batch],TODAY,35,{tasks:{total:5,done:0}})).toMatchObject({mood:'alerted',dailyDeaths:10,deathSpike:true});
  });
  it('uses the saved daily death limit and the previous seven days as a baseline', () => {
    const batch={...item(),mortality:[{entry_date:'2026-11-07',count:70},{entry_date:TODAY,count:12}]};
    expect(flockCompanion([batch],TODAY,35).deathSpike).toBe(false);
    expect(flockCompanion([batch],TODAY,35,{dailyDeathLimit:5}).deathSpike).toBe(true);
  });
  it('does not treat an empty farm as a completed day', () => {
    expect(flockCompanion([],TODAY)).toMatchObject({batch:null,mood:'sleepy',complete:false});
  });
  it('escapes user and batch names and keeps financial reasons out of the staff banner', () => {
    const mascot=flockCompanion([item()],TODAY,35,{dailyNetCentavos:-100});
    expect(renderCompanion(mascot,[item()],{staff:true})).not.toContain('costs are above sales');
    expect(renderWelcome({name:'<script>alert(1)</script>'})).not.toContain('<script>');
    expect(userDisplayName({name:'Olivia'})).toBe('Olivia');
  });
});
