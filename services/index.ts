import { request } from '../util';

export function getPokemons(params: API.PokemonsParams = { limit: 20, offset: 0 }): Promise<API.Pokemons> {
  return request.get('https://pokeapi.co/api/v2/pokemon', { params });
}

export function getPokemonFromUrl(url: string): Promise<API.Pokemon> {
  return request.get(url);
}
