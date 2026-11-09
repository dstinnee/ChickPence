/** Hosted counting contract. Images are sent only after Count image is chosen. */
export const MAX_COUNT_IMAGE_BYTES = 10 * 1024 * 1024;
export const COUNT_TYPES = ['chickens', 'pullets', 'chicks', 'eggs'];
export function validateCountImage(file) {
  if (!file) throw new Error('Choose an image first.');
  if (!['image/jpeg','image/png','image/webp'].includes(file.type)) throw new Error('Use a JPG, PNG or WebP image.');
  if (file.size > MAX_COUNT_IMAGE_BYTES) throw new Error('Choose an image smaller than 10 MB.');
  if (!file.size) throw new Error('This image is empty. Choose another image.');
  return file;
}
export function validateCountResult(value) {
  if (!value || !['counted','not_poultry','undetermined'].includes(value.status)) throw new Error('The counting service returned an unreadable result. Please try again.');
  const counts = {};
  for (const type of COUNT_TYPES) {
    const count = value.counts?.[type];
    if (value.status === 'counted' && (!Number.isSafeInteger(count) || count < 0 || count > 1000000)) throw new Error('The counting service returned an invalid count. Please try again.');
    counts[type] = value.status === 'counted' ? count : null;
  }
  if (value.status === 'counted' && Object.values(counts).reduce((a,b)=>a+b,0) === 0) throw new Error('The service could not confirm a visible count. Try a clearer photo.');
  return { status:value.status, counts, explanation:String(value.explanation || '').slice(0,700),
    otherEntities:Array.isArray(value.otherEntities) ? value.otherEntities.filter(v=>typeof v==='string').map(v=>v.slice(0,80)).slice(0,8) : [] };
}
export async function countPoultry(file, {signal} = {}) {
  validateCountImage(file);
  const endpoint = import.meta.env.VITE_CHICKCOUNT_API_URL;
  if (!endpoint) throw new Error('ChickCount’s hosted counting service is not connected yet. Image upload and preview are ready; counting needs the hosted API.');
  const body = new FormData();
  body.append('image',file);
  const response = await fetch(endpoint,{method:'POST',body,signal,credentials:'omit'});
  if (!response.ok) {
    if (response.status === 429) throw new Error('ChickCount is busy. Please try again in a moment.');
    throw new Error('The counting service could not process this image. Try again or choose a clearer photo.');
  }
  return validateCountResult(await response.json());
}
