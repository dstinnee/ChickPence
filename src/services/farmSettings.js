/**
 * farmSettings.js
 * Farm-level settings kept on this device until they move to the server
 * (farm_settings table). Read and written through try/catch: storage can be
 * blocked (private window), and the app must still work with the defaults.
 */

const KEY = 'chickpence_farm_settings';

export const DEFAULT_SETTINGS = Object.freeze({
  /** Days from chick placement to planned harvest; drives the mascot stage and "sell or keep" card. */
  targetHarvestDays: 35,
  /** Deaths in one day that should raise an alert (null = only the 7-day-average rule). */
  dailyDeathLimit: null,
  /** Time daily tasks are due, HH:MM in the farm's local time. */
  taskDueTime: '18:00',
  /** Role being previewed in the UI (owner, admin, staff) until accounts carry real roles. */
  previewRole: 'owner'
});

function storage() {
  try {
    return globalThis.localStorage ?? null;
  } catch (_) {
    return null;
  }
}

export function getFarmSettings() {
  try {
    const raw = storage()?.getItem(KEY);
    return { ...DEFAULT_SETTINGS, ...(raw ? JSON.parse(raw) : {}) };
  } catch (_) {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveFarmSettings(patch) {
  const next = { ...getFarmSettings(), ...patch };
  try {
    storage()?.setItem(KEY, JSON.stringify(next));
  } catch (_) {
    // Not saved on this device; the change still applies until reload
  }
  return next;
}

/** Day markers such as "no receipts today", per date, on this device. */
const MARK_KEY = 'chickpence_day_marks';

export function getDayMarks() {
  try {
    const raw = storage()?.getItem(MARK_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (_) {
    return {};
  }
}

export function setDayMark(mark) {
  const marks = { ...getDayMarks(), [mark]: true };
  try {
    storage()?.setItem(MARK_KEY, JSON.stringify(marks));
  } catch (_) {}
  return marks;
}
