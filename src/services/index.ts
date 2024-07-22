import { request } from '../helpers'
import { Ability, Item, Pokemon, PokemonSpecies, Result } from '../types'

const LIMIT = 20

export function getPokemonList(page: number): Promise<Result<Item>> {
  return request
    .get('pokemon', {
      searchParams: {
        limit: LIMIT,
        offset: (page - 1) * LIMIT,
      },
    })
    .json()
}

export function getPokemonById(id: string | number): Promise<Pokemon> {
  return request.get(`pokemon/${id}`).json()
}

export function getSpeciesById(id: string | number): Promise<PokemonSpecies> {
  return request.get(`pokemon-species/${id}`).json()
}

export function getAbilityById(id: string | number): Promise<Ability> {
  return request.get(`ability/${id}`).json()
}
