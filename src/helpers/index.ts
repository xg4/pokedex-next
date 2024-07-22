import { ZERO_IMAGE } from '@/constants'
import { compact, defaultTo, get, head, map, pipe } from 'lodash/fp'
import PokeAPI from 'pokedex-promise-v2'

export * from './color'

export function getImageBySprites(sprites?: PokeAPI.PokemonSprites): string {
  const keys = [
    'other.dream_world.front_default',
    'other.home.front_default',
    'other.official-artwork.front_default',
    'front_default',
  ]
  return pipe(
    map((path: string) => get(path)(sprites)),
    compact,
    head,
    defaultTo(ZERO_IMAGE),
  )(keys)
}
