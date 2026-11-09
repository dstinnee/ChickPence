import { can } from './permissions.js';
/** Device-only review tracker until farm membership and server review tables exist. */
export function newReviewRequest({row,proposed,reason,user,now=new Date().toISOString()}) {
  if(!row)throw new Error('Choose a saved farm entry.');
  if(!String(proposed||'').trim())throw new Error('Describe the correction you need.');
  if(!String(reason||'').trim())throw new Error('Give a reason so the reviewer can check the request.');
  return {id:crypto.randomUUID(),recordId:row.id,batchId:row.batchId,batch:row.batch,type:row.type,date:row.date,before:row.change,proposed:String(proposed).trim().slice(0,1500),reason:String(reason).trim().slice(0,1500),requestedBy:user.id,requestedName:user.name||user.email||'Farm user',requestedAt:now,status:'pending',reviewedAt:null,reviewedBy:null,note:''};
}
export function reviewRequest(request,{decision,note,user,role,now=new Date().toISOString()}) {
  if(!can(role,'approve.requests'))throw new Error('Only a farm owner or admin can review requests.');
  if(request.requestedBy===user.id)throw new Error('Another farm reviewer must review your own request.');
  if(request.status!=='pending')throw new Error('This request has already been reviewed.');
  if(!['approved','rejected'].includes(decision))throw new Error('Choose approve or reject.');
  if(!String(note||'').trim())throw new Error('Add a review note explaining the decision.');
  return {...request,status:decision,note:String(note).trim().slice(0,1500),reviewedAt:now,reviewedBy:user.id,reviewedName:user.name||user.email||'Farm reviewer'};
}
export function filterReviewRequests(rows,{q='',status='',type='',from='',to=''}={}) {
  return rows.filter(r=>(!q||`${r.batch} ${r.recordId} ${r.requestedName}`.toLowerCase().includes(q.toLowerCase()))&&(!status||r.status===status)&&(!type||r.type===type)&&(!from||r.requestedAt.slice(0,10)>=from)&&(!to||r.requestedAt.slice(0,10)<=to));
}
