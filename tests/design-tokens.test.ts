import {readFileSync} from 'node:fs';
import {describe, expect, it} from 'vitest';

const css = readFileSync(new URL('../src/design/tokens.css', import.meta.url), 'utf8');
const tokens = Object.fromEntries([...css.matchAll(/--ds-([\w-]+):\s*([^;]+);/g)].map(match => [match[1], match[2].trim()]));
function luminance(token: string) {
  const hex = tokens[token];
  if (!/^#[\da-f]{6}$/i.test(hex ?? '')) throw Error(`Expected an opaque six-digit color: ${token}`);
  const rgb = [1, 3, 5].map(offset => parseInt(hex.slice(offset, offset + 2), 16) / 255)
    .map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
  return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
}
function contrast(first: string, second: string) {
  const pair = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (pair[0] + .05) / (pair[1] + .05);
}

describe('Notedra proposed design-token contract', () => {
  it('keeps all learning text roles readable on the three reading surfaces', () => {
    for (const text of ['ink', 'text', 'support']) for (const surface of ['page', 'paper', 'soft']) {
      expect(contrast(text, surface), `${text} on ${surface}`).toBeGreaterThanOrEqual(4.5);
    }
  });
  it('keeps course and semantic labels readable on their intended tints', () => {
    for (const role of ['co', 'rl', 'ip', 'success', 'warning', 'error', 'info']) {
      expect(contrast(role, `${role}-soft`), role).toBeGreaterThanOrEqual(4.5);
    }
    expect(new Set(['co', 'rl', 'ip'].map(role => tokens[role])).size).toBe(3);
  });
  it('keeps navigation, action and code text readable', () => {
    for (const [text, surface] of [['nav-text', 'nav'], ['nav-muted', 'nav'], ['ink', 'nav-active'], ['on-primary', 'primary'], ['on-primary', 'primary-hover'], ['code-text', 'code-bg']]) {
      expect(contrast(text, surface), `${text} on ${surface}`).toBeGreaterThanOrEqual(4.5);
    }
  });
  it('provides focus contrast and the complete layout token families', () => {
    for (const surface of ['page', 'paper', 'soft']) expect(contrast('focus', surface)).toBeGreaterThanOrEqual(3);
    for (const token of ['space-1', 'space-8', 'title', 'section-title', 'card-title', 'body', 'meta', 'label', 'reading-leading', 'radius-sm', 'radius', 'radius-lg', 'shadow', 'shadow-raised', 'motion', 'ease']) expect(tokens[token], token).toBeTruthy();
  });
});
