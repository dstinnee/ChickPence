/** Concern-board preview helpers. No farm records or network requests are changed. */
export const CONCERN_STATUSES = ['Open', 'In progress', 'Solved'];
export const CONCERN_CATEGORIES = ['Sick or weak birds', 'Feed problem', 'Equipment', 'Safety', 'Other'];
export function sampleConcerns() {
 return [
  {id:'sample-concern-1',category:'Sick or weak birds',urgency:'Urgent',text:'Several birds near feeder 3 are limping and not eating.',by:'Ana Reyes',authorId:'u-ana',batchId:'',batchName:'Batch 2026-09',createdAt:'2026-11-09T07:10:00+08:00',status:'Open',sample:true,thread:[{id:'m1',by:'Ana Reyes',authorId:'u-ana',text:'Several birds near feeder 3 are limping and not eating. Counted about 8.',manager:false,createdAt:'2026-11-09T07:10:00+08:00'}]},
  {id:'sample-concern-2',category:'Equipment',urgency:'Normal',text:'The water line in house 2 is leaking.',by:'Jun Macaraeg',authorId:'u-jun',batchId:'',batchName:'Batch 2026-07',createdAt:'2026-11-08T15:40:00+08:00',status:'In progress',sample:true,thread:[{id:'m2',by:'Jun Macaraeg',authorId:'u-jun',text:'The water line in house 2 is leaking near the corner.',manager:false,createdAt:'2026-11-08T15:40:00+08:00'},{id:'m3',by:'Mario Dela Cruz',authorId:'u-mario',text:'Thanks Jun. A plumber is coming tomorrow morning.',manager:true,createdAt:'2026-11-08T16:10:00+08:00'}]},
  {id:'sample-concern-3',category:'Feed problem',urgency:'Normal',text:'The last feed sack smelled damp.',by:'Ana Reyes',authorId:'u-ana',batchId:'',batchName:'Batch 2026-09',createdAt:'2026-11-06T08:15:00+08:00',status:'Solved',sample:true,thread:[{id:'m4',by:'Ana Reyes',authorId:'u-ana',text:'The last feed sack smelled damp.',manager:false,createdAt:'2026-11-06T08:15:00+08:00'},{id:'m5',by:'Mario Dela Cruz',authorId:'u-mario',text:'Set it aside and used a new sack. Supplier informed.',manager:true,createdAt:'2026-11-06T09:10:00+08:00'}]}
 ];
}
export function visibleConcerns(records,role,actorId) {return role==='staff'?records.filter(c=>c.authorId===actorId):records;}
export function concernCounts(records) {return Object.fromEntries(CONCERN_STATUSES.map(status=>[status,records.filter(c=>c.status===status).length]));}
export function createConcern(input,{actor,batches,now=new Date().toISOString(),id=crypto.randomUUID()}) {
 const text=String(input.text||'').trim();
 if(!text)throw new Error('Describe the problem you can see.');
 if(text.length>1500)throw new Error('Keep the description under 1,500 characters.');
 if(!CONCERN_CATEGORIES.includes(input.category))throw new Error('Choose a concern category.');
 if(!['Normal','Urgent'].includes(input.urgency))throw new Error('Choose Normal or Urgent.');
 if(input.photo && (!/^data:image\/(jpeg|png|webp);base64,/.test(input.photo)||input.photo.length>1500000))throw new Error('Choose a JPG, PNG or WebP photo smaller than 1 MB.');
 const batch=input.batchId==='farm'?null:batches.find(b=>b.batch_id===input.batchId);
 if(input.batchId!=='farm'&&!batch)throw new Error('Choose an available batch.');
 return {id,category:input.category,urgency:input.urgency,text,by:actor.name,authorId:actor.id,batchId:batch?.batch_id||null,batchName:batch?.batch_name||'Farm (shared)',createdAt:now,status:'Open',sample:false,photo:input.photo||null,thread:[{id:`${id}:first`,by:actor.name,authorId:actor.id,text,manager:actor.role!=='staff',createdAt:now}]};
}
export function addConcernReply(record,text,actor,now=new Date().toISOString()) {
 if(!String(text||'').trim())throw new Error('Write a reply first.');
 if(text.trim().length>1500)throw new Error('Keep replies under 1,500 characters.');
 if(actor.role==='staff'&&record.authorId!==actor.id)throw new Error('You can reply only to your own concerns.');
 return {...record,thread:[...(record.thread||[]),{id:crypto.randomUUID(),by:actor.name,authorId:actor.id,text:text.trim(),manager:actor.role!=='staff',createdAt:now}]};
}
export function changeConcernStatus(record,status,actor,now=new Date().toISOString()) {
 if(!['owner','admin'].includes(actor.role))throw new Error('A farm manager changes concern status.');
 if(!CONCERN_STATUSES.includes(status))throw new Error('Choose an available status.');
 return {...record,status,updatedAt:now};
}
