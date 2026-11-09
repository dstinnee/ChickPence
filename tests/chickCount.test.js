import { describe, it, expect, vi, afterEach } from 'vitest';
import { validateCountImage, validateCountResult, countPoultry, MAX_COUNT_IMAGE_BYTES } from '../src/services/chickCount.js';
import { renderCountResult, renderChickCount } from '../src/ui/chickCountView.js';
import { renderTaskTracker } from '../src/ui/homeWidgets.js';
const file = {type:'image/png',size:20};
afterEach(()=>{vi.unstubAllEnvs();vi.unstubAllGlobals();});
describe('ChickCount upload and result contract',()=>{
  it('accepts supported photos and rejects empty, oversized or unsupported files',()=>{
    expect(validateCountImage(file)).toBe(file);
    expect(()=>validateCountImage({...file,size:MAX_COUNT_IMAGE_BYTES+1})).toThrow('10 MB');
    expect(()=>validateCountImage({...file,type:'image/svg+xml'})).toThrow('JPG');
    expect(()=>validateCountImage({...file,size:0})).toThrow('empty');
  });
  it('validates nonnegative integer counts for each distinct poultry category',()=>{
    const counts={chickens:4,pullets:2,chicks:7,eggs:5};
    expect(validateCountResult({status:'counted',counts})).toMatchObject({status:'counted',counts});
    expect(()=>validateCountResult({status:'counted',counts:{...counts,chicks:-1}})).toThrow('invalid count');
    expect(()=>validateCountResult({status:'counted',counts:{...counts,pullets:1.2}})).toThrow('invalid count');
    expect(()=>validateCountResult({status:'counted',counts:{chickens:0,pullets:0,chicks:0,eggs:0}})).toThrow('confirm');
  });
  it('keeps indeterminate and non-poultry results distinct from a count of zero',()=>{
    for(const status of ['undetermined','not_poultry']) {
      const r=validateCountResult({status,counts:{chickens:999},explanation:'Try another angle'});
      expect(r.counts.chickens).toBeNull();
      expect(renderCountResult(r)).not.toContain('count-results-grid');
    }
    expect(renderCountResult(validateCountResult({status:'undetermined'}))).toContain('Count cannot be determined');
    expect(renderCountResult(validateCountResult({status:'not_poultry'}))).toContain('No poultry or eggs');
  });
  it('escapes service explanations and other-entity labels',()=>{
    const html=renderCountResult(validateCountResult({status:'not_poultry',explanation:'<script>x</script>',otherEntities:['<b>dog</b>']}));
    expect(html).not.toContain('<script>');expect(html).not.toContain('<b>dog</b>');
  });
  it('never invents a count when a hosted endpoint has not been connected',async()=>{
    vi.stubEnv('VITE_CHICKCOUNT_API_URL','');
    const fetchMock=vi.fn();vi.stubGlobal('fetch',fetchMock);
    await expect(countPoultry(file)).rejects.toThrow('not connected');
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it('posts the chosen photo only when counting is requested and validates the response',async()=>{
    vi.stubEnv('VITE_CHICKCOUNT_API_URL','https://count.example/api');
    const fetchMock=vi.fn().mockResolvedValue({ok:true,json:async()=>({status:'counted',counts:{chickens:1,pullets:2,chicks:3,eggs:4}})});
    vi.stubGlobal('fetch',fetchMock);
    const photo=new File(['test'],'poultry.png',{type:'image/png'});
    expect((await countPoultry(photo)).counts.chicks).toBe(3);
    expect(fetchMock.mock.calls[0][0]).toBe('https://count.example/api');
    expect(fetchMock.mock.calls[0][1].body.get('image').name).toBe('poultry.png');
  });
  it('provides an image upload tool without local-AI controls',()=>{
    const html=renderChickCount();
    expect(html).toContain('Upload image');expect(html).toContain('feather-launcher');
    expect(html).not.toContain('Local AI settings');
  });
});
describe('Staff task completion tracker',()=>{
  it('shows the same actual completion figures as the daily task list',()=>{
    const html=renderTaskTracker({total:5,done:2,overdue:1});
    expect(html).toContain('aria-valuenow="40"');
    expect(html).toContain('2 of 5 tasks completed');
    expect(html).toContain('<dt>Remaining</dt><dd>3</dd>');
    expect(html).toContain('<dt>Overdue</dt><dd>1</dd>');
  });
  it('handles the empty and completed day without dividing by zero',()=>{
    expect(renderTaskTracker({total:0,done:0})).toContain('aria-valuenow="0"');
    expect(renderTaskTracker({total:5,done:5})).toContain('aria-valuenow="100"');
  });
});
