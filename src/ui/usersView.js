import { option as opt } from './farmTable.js';
import { header, table, pill, empty } from './redesignKit.js';
import { formatDate } from '../services/calculations.js';
/**
 * usersView.js
 * User Management (admin-panel layout) and the Roles screen (built-in role
 * cards with permission checkboxes), thesis audit sections 15 and 17.
 *
 * The user list is a preview kept on this device until the profiles table and
 * role rules exist on the server; the page says so.
 */

import { ROLES, PERMISSION_GROUPS, roleLabel } from '../services/permissions.js';
import { escapeHtml } from './html.js';

const KEY = 'chickpence_preview_users';

function seedUsers(currentEmail) {
  return [
    { id: 'u-owner', name: 'Farm owner', login: currentEmail || 'owner@chickpence.ph', role: 'owner', status: 'active', batches: 'All', joined: '2026-09-01', lastSignIn: 'Now' },
    { id: 'u-mario', name: 'Mario Dela Cruz', login: 'mario', role: 'admin', status: 'active', batches: 'All', joined: '2026-09-03', lastSignIn: 'Today, 6:10 AM' },
    { id: 'u-ana', name: 'Ana Reyes', login: 'ana', role: 'staff', status: 'active', batches: 'Batch 2026-09', joined: '2026-09-10', lastSignIn: 'Today, 7:02 AM' },
    { id: 'u-jun', name: 'Jun Macaraeg', login: 'jun', role: 'staff', status: 'active', batches: 'Batch 2026-07', joined: '2026-09-10', lastSignIn: 'Yesterday, 5:41 PM' },
    { id: 'u-lito', name: 'Lito Santos', login: 'lito', role: 'staff', status: 'deactivated', batches: '—', joined: '2026-09-12', lastSignIn: 'Oct 2, 2026' },
    { id: 'u-invite', name: 'Rosa (invited)', login: 'rosa', role: 'staff', status: 'pending', batches: 'Batch 2026-09', joined: '—', lastSignIn: 'Not yet' }
  ];
}

export function loadPreviewUsers(currentEmail) {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return seedUsers(currentEmail);
}

export function savePreviewUsers(users) {
  try {
    localStorage.setItem(KEY, JSON.stringify(users));
  } catch (_) {}
}

/** Counter cards for a farm-sized team (pure). */
export function userCounts(users) {
  return {
    staff: users.filter((u) => u.role === 'staff' && u.status === 'active').length,
    admins: users.filter((u) => u.role === 'admin' && u.status === 'active').length,
    pending: users.filter((u) => u.status === 'pending').length,
    deactivated: users.filter((u) => u.status === 'deactivated').length
  };
}

export function filterUsers(users, { q = '', role = '', status = '' } = {}) {
  const query = q.trim().toLowerCase();
  return users.filter((u) =>
    (!query || u.name.toLowerCase().includes(query) || u.login.toLowerCase().includes(query)) &&
    (!role || u.role === role) &&
    (!status || u.status === status));
}

const STATUS_LABEL = { active: 'Active', pending: 'Invited', deactivated: 'Deactivated' };

const manageable=(u,role)=>u.role!=='owner'&&(role==='owner'||u.role==='staff');
export function renderUsers(users,filters={},viewerRole='owner') {
 const c=userCounts(users),shown=filterUsers(users,filters);
 const counters=[['staff','Staff',c.staff],['admin','Admins',c.admins],['pending','Pending invites',c.pending],['deactivated','Deactivated',c.deactivated]];
 return `<section class="page-section">${header('Users','People who care for your farm.','<button class="btn-action primary" type="button" id="btn-add-user">+ Add user</button>')}<div class="user-counters">${counters.map(([key,label,n])=>`<button type="button" class="card-box" data-user-counter="${key}"><span>${label}</span><b>${n}</b></button>`).join('')}</div><form class="farm-filterbar" id="user-filters"><label>Search<input type="search" name="q" value="${escapeHtml(filters.q||'')}" placeholder="Name or username"/></label><label>Role<select name="role">${opt('','All roles',filters.role)}${ROLES.map(r=>opt(r.id,r.label,filters.role)).join('')}</select></label><label>Status<select name="status">${opt('','All statuses',filters.status)}${Object.entries(STATUS_LABEL).map(([key,label])=>opt(key,label,filters.status)).join('')}</select></label></form><div class="rd-action-row"><button type="button" class="btn-action" id="rd-bulk-assign">Assign selected</button><button type="button" class="btn-action" id="rd-bulk-deactivate">Deactivate selected</button></div>${shown.length?table(['Select','User','Role','Assigned batches','Status','Last sign-in','Joined','Actions'],shown.map(u=>[
 manageable(u,viewerRole)?`<input type="checkbox" class="rd-user-check" value="${escapeHtml(u.id)}" aria-label="Select ${escapeHtml(u.name)}"/>`:'',
 `<div class="user-wrap"><span class="cp-avatar small">${escapeHtml(u.name.slice(0,2).toUpperCase())}</span><span class="user-cell"><b>${escapeHtml(u.name)}</b><small>${escapeHtml(u.login)}</small></span></div>`,pill(roleLabel(u.role)),String(u.batches||'—').split(',').map(b=>pill(b.trim())).join(' '),pill(STATUS_LABEL[u.status],u.status==='active'?'good':u.status==='pending'?'watch':'neutral'),/^\d{4}-/.test(u.lastSignIn)?formatDate(u.lastSignIn.slice(0,10),true):escapeHtml(u.lastSignIn||'Not recorded'),/^\d{4}-/.test(u.joined)?formatDate(u.joined,true):'—',
 manageable(u,viewerRole)?`<details class="rd-row-menu"><summary aria-label="Actions for ${escapeHtml(u.name)}">⋯</summary><button type="button" data-edit-user="${escapeHtml(u.id)}">Edit role & assignments</button><button type="button" data-user-status="${escapeHtml(u.id)}" data-to="${u.status==='deactivated'?'active':'deactivated'}">${u.status==='deactivated'?'Reactivate':'Deactivate'}</button></details>`:''])):empty('No people match','Try another name, role or status.')}<p class="farm-footnote">Device-only user preview. Changes do not create accounts or change sign-in access.</p></section>`;
}
function openUserDrawer(viewerRole,existing,onSave) {
 const d=document.createElement('dialog');d.className='entry-drawer';d.setAttribute('aria-label',existing?'Edit farm user':'Add farm user');
 const value=k=>escapeHtml(existing?.[k]||'');
 d.innerHTML=`<form class="pc-form"><h2>${existing?'Edit user':'Add user'}</h2><p class="text-mut">Device-only preview. This does not create a sign-in account.</p><label>Full name<input name="name" value="${value('name')}" required maxlength="120"/></label><label>Username or email<input name="login" value="${value('login')}" required maxlength="180"/></label><label>Role<select name="role">${ROLES.filter(r=>r.id!=='owner'&&(viewerRole==='owner'||r.id==='staff')).map(r=>`<option value="${r.id}" ${existing?.role===r.id?'selected':''}>${r.label}</option>`).join('')}</select></label><label>Assigned batches<input name="batches" value="${value('batches')}" placeholder="Batch names separated by commas"/></label><h3>Optional staff permissions</h3>${[['sale.record','Record sales'],['record.expense','Record receipts'],['batch.cost','See cost to date']].map(([id,label])=>`<label class="rd-check-chip"><input type="checkbox" name="permissions" value="${id}" ${existing?.permissions?.includes(id)?'checked':''}/>${label}</label>`).join('')}<h3>Password or PIN</h3><p class="text-mut">Account creation and password resets are coming soon. Your current sign-in details stay unchanged.</p><div class="rd-action-row"><button class="btn-action" type="button" data-close>Cancel</button><button class="btn-action primary" type="submit">Save preview</button></div></form>`;
 document.body.append(d);const close=()=>{d.close();d.remove();};d.querySelector('[data-close]').onclick=close;d.addEventListener('cancel',close);
 d.querySelector('form').onsubmit=e=>{e.preventDefault();const data=new FormData(e.currentTarget),input=Object.fromEntries(data);onSave({...existing,id:existing?.id||`u-${Date.now()}`,name:input.name.trim(),login:input.login.trim(),role:input.role,batches:input.batches.trim()||'—',permissions:data.getAll('permissions'),status:existing?.status||'pending',joined:existing?.joined||new Date().toISOString().slice(0,10),lastSignIn:existing?.lastSignIn||'Not yet'});close();};d.showModal();d.querySelector('input').focus();
}
export function attachUsersListeners(container,users,viewerRole,{onChange,onFilter}) {
 const form=container.querySelector('#user-filters');form?.addEventListener('input',()=>onFilter(Object.fromEntries(new FormData(form))));form?.addEventListener('submit',e=>e.preventDefault());
 container.querySelectorAll('[data-user-counter]').forEach(b=>b.addEventListener('click',()=>{const key=b.dataset.userCounter;onFilter(['staff','admin'].includes(key)?{role:key}:{status:key});}));
 const add=u=>onChange(users.some(p=>p.id===u.id)?users.map(p=>p.id===u.id?u:p):[...users,u]);
 container.querySelector('#btn-add-user')?.addEventListener('click',()=>openUserDrawer(viewerRole,null,add));
 container.querySelectorAll('[data-edit-user]').forEach(b=>b.addEventListener('click',()=>{const u=users.find(p=>p.id===b.dataset.editUser);if(u&&manageable(u,viewerRole))openUserDrawer(viewerRole,u,add);}));
 container.querySelectorAll('[data-user-status]').forEach(b=>b.addEventListener('click',()=>{const u=users.find(p=>p.id===b.dataset.userStatus);if(u&&manageable(u,viewerRole)&&confirm(`${b.dataset.to==='active'?'Reactivate':'Deactivate'} ${u.name}? This changes the device-only user preview.`))onChange(users.map(p=>p.id===u.id?{...p,status:b.dataset.to}:p));}));
 const selected=()=>[...container.querySelectorAll('.rd-user-check:checked')].map(i=>i.value);
 container.querySelector('#rd-bulk-deactivate')?.addEventListener('click',()=>{const ids=selected();if(!ids.length)return;if(confirm(`Deactivate ${ids.length} selected people in this device preview?`))onChange(users.map(u=>ids.includes(u.id)&&manageable(u,viewerRole)?{...u,status:'deactivated'}:u));});
 container.querySelector('#rd-bulk-assign')?.addEventListener('click',()=>{const ids=selected();if(!ids.length)return;const batches=prompt('Batch names for the selected people (comma-separated):');if(batches!==null)onChange(users.map(u=>ids.includes(u.id)&&manageable(u,viewerRole)?{...u,batches:batches.trim()||'—'}:u));});
}
export function renderRoles(selected='staff') {
 const r=ROLES.find(r=>r.id===selected)||ROLES[2];
 return `<section class="page-section">${header('Roles','Built-in access, with optional staff permissions set per person.')}<nav class="farm-tabs" aria-label="Choose a role">${ROLES.map(role=>`<button type="button" data-role-detail="${role.id}" class="${role.id===r.id?'active':''}">${role.label}</button>`).join('')}</nav><article class="rd-panel"><header class="page-head"><h2>${r.label}</h2><button class="btn-action" type="button" data-preview-role="${r.id}">Preview this role</button></header><p class="text-mut">${escapeHtml(r.blurb)}</p><div class="perm-groups">${PERMISSION_GROUPS.map(g=>`<section class="perm-group"><h3>${escapeHtml(g.group)}</h3>${g.items.map(p=>`<label class="rd-check-chip"><input type="checkbox" disabled ${p[r.id]==='always'&&g.group!=='Payroll'?'checked':''}/><span>${escapeHtml(p.label)}${g.group==='Payroll'?' · Coming soon':p[r.id]==='optional'?' · Optional per person':''}</span></label>`).join('')}</section>`).join('')}</div></article></section>`;
}
