import { escapeHtml } from './html.js';
export function farmTabs(tabs, active, attribute='data-farm-tab') {
  return `<nav class="farm-tabs" aria-label="Page sections">${tabs.map(([id,label])=>`<button type="button" ${attribute}="${escapeHtml(id)}" class="${id===active?'active':''}" ${id===active?'aria-current="page"':''}>${escapeHtml(label)}</button>`).join('')}</nav>`;
}
export function farmPagination(total, page=1, size=10) {
  if(total<=size)return "";
  const pages=Math.max(1,Math.ceil(total/size)), current=Math.min(pages,Math.max(1,page));
  return `<div class="farm-pagination"><span>${total ? (current-1)*size+1 : 0}–${Math.min(current*size,total)} of ${total.toLocaleString()} records</span><div class="farm-page-buttons"><button type="button" class="btn-action" data-farm-page="${current-1}" ${current===1?'disabled':''} aria-label="Previous page">‹</button><span>Page ${current} of ${pages}</span><button type="button" class="btn-action" data-farm-page="${current+1}" ${current===pages?'disabled':''} aria-label="Next page">›</button></div><label>Rows<select data-farm-size aria-label="Rows per page">${[10,25,50].map(n=>`<option value="${n}" ${n===size?'selected':''}>${n} / page</option>`).join('')}</select></label></div>`;
}
export function csvCell(value) {
  let text=String(value??'');
  if(typeof value==='string' && /^[\s]*[=+\-@]/.test(text)) text="'"+text;
  return /[",\r\n]/.test(text)?`"${text.replace(/"/g,'""')}"`:text;
}
export function downloadFarmCsv(name,headers,rows) {
  const csv=[headers,...rows].map(row=>row.map(csvCell).join(',')).join('\r\n');
  const url=URL.createObjectURL(new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8'}));
  const link=document.createElement('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export function attachFarmPagination(container,onPage,onSize) {
  container.querySelectorAll('[data-farm-page]').forEach(button=>button.addEventListener('click',()=>onPage(Number(button.dataset.farmPage))));
  container.querySelector('[data-farm-size]')?.addEventListener('change',e=>onSize(Number(e.target.value)));
}
export const option=(value,label,current)=>`<option value="${escapeHtml(value)}" ${value===current?'selected':''}>${escapeHtml(label)}</option>`;
