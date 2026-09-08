export type ValueFormat = 'decimal' | 'hex';
export interface Preferences { format: ValueFormat; }
const prefix = 'delftstudy:v1:';

export function readLocal(key: string): string | null {
  try { return localStorage.getItem(prefix + key); } catch { return null; }
}
export function writeLocal(key: string, value: string): boolean {
  try { localStorage.setItem(prefix + key, value); return true; } catch { return false; }
}
export function readPreferences(): Preferences {
  return { format: readLocal('format') === 'hex' ? 'hex' : 'decimal' };
}
export function formatValue(value: bigint, format: ValueFormat): string {
  return format === 'hex' ? `0x${BigInt.asUintN(64, value).toString(16).toUpperCase()}` : value.toString();
}
