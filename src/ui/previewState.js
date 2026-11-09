/** UI-only preview state, namespaced to the signed-in account. Never synced or used in calculations. */
export function readPreview(scope,key,fallback={}) {try {return JSON.parse(localStorage.getItem(`cp-ui-preview:${scope}:${key}`))??fallback;}catch{return fallback;}}
export function writePreview(scope,key,value) {try {localStorage.setItem(`cp-ui-preview:${scope}:${key}`,JSON.stringify(value));return true;}catch{return false;}}
export function assignedItems(items,person) {
 if(!person||person.status!=='active')return [];
 const assigned=Array.isArray(person.batchIds)?person.batchIds:String(person.batches||'').split(',').map(s=>s.trim());
 return items.filter(i=>assigned.includes(i.batch.batch_id)||assigned.includes(i.batch.batch_name)||assigned.includes('All'));
}
