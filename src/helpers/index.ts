import { last, pipe, words } from 'lodash/fp'

export * from './getColor'
export * from './request'

export function getIdByUrl(url: string) {
  return pipe(words, last)(url)
}
