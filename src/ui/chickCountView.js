import { countPoultry, validateCountImage, COUNT_TYPES } from '../services/chickCount.js';
import { escapeHtml } from './html.js';

export function renderCountResult(result) {
  if (!result) return '';
  const title = result.status === 'counted' ? 'Here’s what’s in the image' : result.status === 'not_poultry' ? 'No poultry or eggs identified' : 'Count cannot be determined';
  return `<section class="count-result" aria-labelledby="count-result-title"><h3 id="count-result-title">${title}</h3>${result.status === 'counted' ? `<dl class="count-results-grid">${COUNT_TYPES.map(type=>`<div><dt>${type === 'pullets' ? 'Pullets (young)' : type[0].toUpperCase()+type.slice(1)}</dt><dd>${result.counts[type].toLocaleString()}</dd></div>`).join('')}</dl>` : ''}<p>${escapeHtml(result.explanation)}</p>${result.otherEntities.length ? `<p class="count-other"><b>Other entities:</b> ${result.otherEntities.map(escapeHtml).join(', ')}</p>` : ''}<small>AI estimate. Review before using these counts. No flock records are changed.</small></section>`;
}
export function renderChickCount() {
  return `<aside class="chickcount" aria-label="ChickCount AI"><section class="chickcount-panel count-upload-panel" id="chickcount-panel" hidden aria-labelledby="chickcount-title">
    <div class="chickcount-head"><div><h2 id="chickcount-title">ChickCount AI</h2><p>A little feather. A clearer count.</p></div><button type="button" id="btn-close-chickcount" aria-label="Close ChickCount AI">×</button></div>
    <p>Count visible chickens, pullets, chicks and eggs from a photo.</p>
    <form id="chickcount-form"><label class="count-dropzone" id="count-dropzone"><input id="count-image-input" type="file" accept="image/jpeg,image/png,image/webp" aria-label="Upload image"/><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8" cy="8" r="1.5"/><path d="m3 17 5-5 4 4 4-6 5 7"/></svg><strong>Upload image</strong><span>Choose a photo or drop it here</span><small>JPG, PNG or WebP · up to 10 MB</small></label>
    <div class="count-preview" id="count-preview" hidden><img id="count-preview-image" alt="Selected photo for poultry counting"/><span id="count-filename"></span><button type="button" class="btn-link" id="count-change">Choose another image</button></div>
    <p class="count-upload-note">Your photo is sent to the hosted counting service only when you select Count image.</p>
    <p class="count-error" id="count-error" role="alert" hidden></p><button type="submit" class="count-submit" id="btn-count-image" disabled>Count image</button></form>
    <div id="count-result" aria-live="polite"></div>
    </section><button type="button" class="chickcount-toggle feather-launcher" id="btn-chickcount" aria-expanded="false" aria-controls="chickcount-panel" aria-label="Open chicken helper" title="Chicken helper"><svg width="34" height="34" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 27 25 6c5 7-1 19-15 18M6 27l6-15C17 3 24 3 25 6M14 19l9-1M18 14l7-1M12 16l1-7"/><path d="m6 27 19-21" stroke="#fff3d1"/></svg><span class="feather-label">Chicken helper</span></button></aside>`;
}
let releasePrevious;
export function attachChickCount(container) {
  releasePrevious?.();
  const toggle=container.querySelector('#btn-chickcount'), panel=container.querySelector('#chickcount-panel');
  if (!toggle || !panel) return;
  const input=container.querySelector('#count-image-input'), preview=container.querySelector('#count-preview');
  const dropzone=container.querySelector('#count-dropzone'), error=container.querySelector('#count-error');
  const button=container.querySelector('#btn-count-image'), result=container.querySelector('#count-result');
  let selected, objectUrl, controller, request=0;
  const resetRequest=()=>{request++;controller?.abort();controller=null;panel.removeAttribute('aria-busy');button.textContent='Count image';};
  const releaseDock=avoidLauncherControls(container.querySelector('.chickcount'),toggle,panel);
  const setOpen=open=>{panel.hidden=!open;toggle.setAttribute('aria-expanded',String(open));if(open) input.focus();else {resetRequest();button.disabled=!selected;toggle.focus();}};
  const showError=text=>{error.textContent=text;error.hidden=!text;};
  const select=file=>{
    resetRequest();showError('');result.innerHTML='';
    selected=null;button.disabled=true;preview.hidden=true;dropzone.hidden=false;
    if(objectUrl) {URL.revokeObjectURL(objectUrl);objectUrl=null;}
    try { validateCountImage(file); }
    catch(err) { showError(err.message); return; }
    selected=file;
    objectUrl=URL.createObjectURL(file);
    container.querySelector('#count-preview-image').src=objectUrl;
    container.querySelector('#count-filename').textContent=file.name;
    preview.hidden=false;dropzone.hidden=true;button.disabled=false;
  };
  toggle.addEventListener('click',()=>setOpen(panel.hidden));
  container.querySelector('#btn-close-chickcount').addEventListener('click',()=>setOpen(false));
  container.querySelector('.chickcount').addEventListener('keydown',e=>{if(e.key==='Escape')setOpen(false);});
  input.addEventListener('change',()=>{if(input.files[0])select(input.files[0]);});
  container.querySelector('#count-change').addEventListener('click',()=>{input.value='';input.click();});
  ['dragenter','dragover'].forEach(event=>dropzone.addEventListener(event,e=>{e.preventDefault();dropzone.classList.add('is-dragging');}));
  dropzone.addEventListener('dragleave',()=>dropzone.classList.remove('is-dragging'));
  dropzone.addEventListener('drop',e=>{e.preventDefault();dropzone.classList.remove('is-dragging');select(e.dataTransfer.files[0]);});
  container.querySelector('#chickcount-form').addEventListener('submit',async e=>{
    e.preventDefault();if(!selected || controller)return;
    showError('');result.innerHTML='';controller=new AbortController();const current=++request;
    button.disabled=true;button.textContent='Counting…';panel.setAttribute('aria-busy','true');
    const timeout=setTimeout(()=>controller?.abort(),60000);
    try {const counted=await countPoultry(selected,{signal:controller.signal});if(current===request)result.innerHTML=renderCountResult(counted);}
    catch(err) {if(current===request)showError(err.name==='AbortError' ? 'Counting took too long. Please try again.' : err.message || 'Could not count this image. Please try again.');}
    finally {clearTimeout(timeout);if(current===request){controller=null;panel.removeAttribute('aria-busy');button.disabled=false;button.textContent='Count image';}}
  });
  releasePrevious=()=>{releaseDock();resetRequest();if(objectUrl)URL.revokeObjectURL(objectUrl);};
}

/** Keep the floating helper clear of nearby controls as the page scrolls. */
function avoidLauncherControls(wrapper,toggle,panel) {
 if(!wrapper||wrapper.closest('.view-concerns'))return ()=>{};
 let frame=0,lastBottom=null,closed=false;
 const place=()=>{
  frame=0;if(closed||!wrapper.isConnected||!panel.hidden)return;
  const bounds=toggle.getBoundingClientRect(),right=bounds.right,left=bounds.left,controls=[...document.querySelectorAll('.cp-main button,.cp-main a,.cp-main input,.cp-main select,.cp-main textarea,.cp-main summary')].filter(e=>!wrapper.contains(e)&&e.getClientRects().length).map(e=>e.getBoundingClientRect()).filter(r=>r.right>left-8&&r.left<right+8&&r.bottom>0&&r.top<innerHeight);
  const candidates=[24,96,168,240].filter(b=>b+bounds.height<innerHeight-80);
  const score=bottom=>{const top=innerHeight-bottom-bounds.height-8,end=innerHeight-bottom+8;return controls.reduce((sum,r)=>sum+Math.max(0,Math.min(end,r.bottom)-Math.max(top,r.top))*Math.max(0,Math.min(right+8,r.right)-Math.max(left-8,r.left)),0);};
  const bottom=candidates.find(b=>score(b)===0)??candidates.reduce((best,b)=>score(b)<score(best)?b:best,candidates[0]||24);
  if(bottom!==lastBottom){lastBottom=bottom;wrapper.style.bottom=`${bottom}px`;}
 };
 const schedule=()=>{if(!frame&&!closed)frame=requestAnimationFrame(place);};
 window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule,{passive:true});
 const observer=typeof ResizeObserver!=='undefined'?new ResizeObserver(schedule):null;observer?.observe(wrapper.closest('.cp-main'));
 document.fonts?.ready.then(schedule);schedule();
 return ()=>{closed=true;if(frame)cancelAnimationFrame(frame);observer?.disconnect();window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);};
}
