import { Ability, Item, Pokemon, PokemonSpecies, Result } from '../types'
import { request } from '../helpers'

const LIMIT = 20

export function getPokemonsByPage(page: number): Promise<Result<Item>> {
  return request.get('/pokemon', {
    params: {
      limit: LIMIT,
      offset: (page - 1) * LIMIT,
    },
  })
}

export function getPokemonById(id: string | number): Promise<Pokemon> {
  return request.get(`/pokemon/${id}`)
}

export function getPokemonSpeciesById(
  id: string | number
): Promise<PokemonSpecies> {
  return request.get(`/pokemon-species/${id}`)
}

export function getAbilityById(id: string | number): Promise<Ability> {
  return request.get(`/ability/${id}`)
}
