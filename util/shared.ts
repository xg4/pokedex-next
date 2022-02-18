import head from 'lodash/fp/head';
import pipe from 'lodash/fp/pipe';
import shuffle from 'lodash/fp/shuffle';
import LRU from 'lru-cache';

const colorsCache = new LRU<string, string>({ max: 1000 });

const colors = [
  '#64748b',
  '#6b7280',
  '#71717a',
  '#737373',
  '#78716c',
  '#ef4444',
  '#f97316',
  '#f59e0b',
  '#eab308',
  '#84cc16',
  '#22c55e',
  '#10b981',
  '#14b8a6',
  '#06b6d4',
  '#0ea5e9',
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#a855f7',
  '#d946ef',
  '#ec4899',
  '#f43f5e',
];

export function randomColors(key?: string): string {
  if (!key) {
    return pipe(shuffle, head)(colors);
  }

  const savedColor = colorsCache.get(key);
  if (savedColor) {
    return savedColor;
  }

  const color = pipe(shuffle, head)(colors);
  colorsCache.set(key, color);
  return color;
}
