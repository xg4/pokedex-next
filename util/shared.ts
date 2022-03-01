import head from 'lodash/fp/head';
import pipe from 'lodash/fp/pipe';
import shuffle from 'lodash/fp/shuffle';
import memoize from 'lodash/memoize';

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

function _randomColors(key: string): string {
  return pipe(shuffle, head)(colors);
}

export const randomColors = memoize(_randomColors);
