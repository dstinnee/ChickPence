import { syncEngine } from '../services/syncEngine.js';
import { openSupabaseConfigModal } from './modals.js';
import { checkAndSeedInitialData } from '../db/seed.js';

/** Sidebar sync line: offline, waiting uploads, or changes the server refused (pure). */
export function renderSyncStatus(syncStatus = {}) {
  const { online = true, pending = 0, problems = 0, isSyncing = false } = syncStatus;
  if (problems > 0) return `<span class="sync-bad">⚠ ${problems} could not upload</span>`;
  if (!online) return `<b>● Offline${pending ? ` · ${pending} waiting` : ''}</b>`;
  if (pending > 0) return `<b>● ${isSyncing ? 'Uploading' : `${pending} waiting to upload`}</b>`;
  return `<span class="ok">● All synced</span>`;
}

export function renderShell(activeView, contentHtml, syncStatus, onNavigate, onLogout, onReload) {
  const syncHtml = renderSyncStatus(syncStatus);

  const glyph = (path) => `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
  const icons = {
    dashboard: glyph('<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>'),
    batches: glyph('<path d="M12 3C8 3 5 11 5 15a7 7 0 0 0 14 0c0-4-3-12-7-12Z"/><path d="m5 13 4 2 3-3 3 3 4-2"/>'),
    history: glyph('<path d="M3 11a9 9 0 1 1 2.4 7M3 4v7h7m2-4v5l3 2"/>'),
    logout: glyph('<path d="M9 4H4v16h5m0-8h12m-4-4 4 4-4 4"/>')
  };
  const navItem = (key, label) => `<button type="button" class="nav-link ${activeView === key || (key==='history' && activeView==='summary') ? 'active' : ''}" data-nav="${key}" ${activeView===key?'aria-current="page"':''}>${icons[key]}<span>${label}</span></button>`;

  return `
    <div class="app-container flock-app">
      <aside class="sidebar flock-sidebar" aria-label="Main navigation">
        <button type="button" class="flock-brand" data-nav="dashboard" aria-label="ChickPence dashboard"><img src="/images/chicken-mascot.png" alt="" width="42" height="42"/><span>ChickPence</span></button>
        <nav class="flock-nav">${navItem('dashboard','Overview')}${navItem('batches','Batches')}${navItem('history','History')}</nav>
        <div class="flock-rail-bottom"><button type="button" class="nav-link" id="btn-shell-logout">${icons.logout}<span>Log out</span></button>
        <button type="button" class="sync-status-box sync-status" id="sidebar-sync-box" title="Sync: waiting uploads and server problems"><span id="sync-indicator-text">${syncHtml}</span></button></div>
      </aside>

      <main class="main-content">
        ${contentHtml}
      </main>
    </div>
  `;
}

export function attachShellListeners(container, onNavigate, onLogout, onReload, onSyncStatus) {
  container.querySelector('#sidebar-sync-box')?.addEventListener('click', () => onSyncStatus?.());

  container.querySelectorAll('[data-nav]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-nav');
      if (target) onNavigate(target);
    });
  });

  const logoutBtn = container.querySelector('#btn-shell-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', onLogout);
  }

  const toggleNetBtn = container.querySelector('#btn-toggle-net');
  if (toggleNetBtn) {
    toggleNetBtn.addEventListener('click', () => {
      syncEngine.toggleSimulatedOffline();
    });
  }

  const cloudBtn = container.querySelector('#btn-open-cloud-config');
  if (cloudBtn) {
    cloudBtn.addEventListener('click', () => {
      openSupabaseConfigModal(onReload);
    });
  }

  const resetDemoBtn = container.querySelector('#btn-reset-demo');
  if (resetDemoBtn) {
    resetDemoBtn.addEventListener('click', async () => {
      if (!confirm('Reset all demo data? This clears IndexedDB and reloads the seed batches.')) return;
      await checkAndSeedInitialData(true);
      onReload();
    });
  }
}
