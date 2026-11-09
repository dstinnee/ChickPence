import { renderEntryFormPanel, attachBatchesListeners } from './batchesView.js';
import { escapeHtml as esc } from './html.js';
import { priceCheck, priceCheckBasis } from './priceCheckView.js';
import { formatPeso, localToday } from '../services/calculations.js';

/** The existing entry forms and handlers, presented in one accessible shared drawer. */
export function openQuickEntry({ container, items, closed = [], tab = 'Feed', batchId, editing = null, prefill, previewExpense, onSaved, staff = false }) {
  const previous = document.activeElement;
  const dialog = document.createElement('dialog');
  dialog.className = 'entry-drawer';
  dialog.setAttribute('aria-label', `Record ${tab === 'Mortality' ? 'deaths' : tab.toLowerCase()}`);
  container.appendChild(dialog);
  const close = () => { dialog.close(); dialog.remove(); previous?.isConnected && previous.focus(); };
  const draw = (expensePreview = null) => {
    const labels = { Feed: 'Record feed', Mortality: 'Record deaths', Expenses: 'Add expense', Sales: 'Record a sale' };
    dialog.innerHTML = `<div id="entry-modal-backdrop" style="display:flex"><div class="quick-entry-content"><header class="page-head"><h2>${labels[tab]}</h2><button class="cp-icon-btn" type="button" data-close-drawer aria-label="Close entry form">×</button></header>${renderEntryFormPanel(tab, items.map(i=>i.batch), batchId || items[0]?.batch.batch_id, editing, expensePreview, prefill ? {values:prefill} : null)}${tab === 'Expenses' ? '<p class="text-mut">Shared costs use the existing farm allocation. Review the split before saving.</p><p id="closed-expense-warning" class="preview-note" hidden></p>' : ''}${tab === 'Sales' && !staff ? '<p id="sale-verdict" class="pc-verdict" aria-live="polite"></p>' : ''}</div></div>`;
    dialog.querySelector('[data-close-drawer]').addEventListener('click',close);
    attachBatchesListeners(dialog, { openBatchesData: items, expenses: [], selectedBatchId: batchId, activeTab: tab, editingItem: editing, collapsedBatchIds: new Set() }, {
      onReload: () => { close(); onSaved(); }, onCancelEdit: () => { close(); onSaved(); },
      onExpensePreview: async (date,feed,other) => draw(await previewExpense(date,feed,other))
    });
    const update = () => {
      if (tab === 'Sales' && !staff) {
        const item=items.find(i=>i.batch.batch_id===dialog.querySelector('#input-batch-select')?.value);
        if (!item) return;
        const r=priceCheck({...priceCheckBasis(item,closed,localToday()),heads:dialog.querySelector('#input-sale-qty').value,kg:dialog.querySelector('#input-sale-kg').value,price:dialog.querySelector('#input-sale-ppk').value});
        const target=dialog.querySelector('#sale-verdict');target.className=`pc-verdict ${r.verdict}`;
        target.textContent=r.verdict==='incomplete'?'Enter the sale details to check the price.':`${r.verdict==='profit'?'Profit':'Loss'} ${formatPeso(Math.abs(r.result))} · Break-even ${formatPeso(r.breakEven)}/kg`;
      }
      if(tab==='Expenses') {
        const date=dialog.querySelector('#input-exp-date')?.value;
        const affected=closed.some(i=>date>=i.batch.start_date && date<=(i.batch.end_date || localToday()));
        const warning=dialog.querySelector('#closed-expense-warning');warning.hidden=!affected;
        warning.textContent='Preview: this date may affect a closed batch. Automatic approval routing is not connected; saving still follows the current expense workflow.';
      }
    };
    dialog.addEventListener('input', update, {once:true});
    dialog.querySelector('.quick-entry-content').addEventListener('input',update);
    update();
  };
  draw();dialog.addEventListener('cancel', e=>{e.preventDefault();close();});dialog.addEventListener('click', e=>{if(e.target===dialog)close();});dialog.showModal();
  dialog.querySelector('input,select')?.focus();
}
