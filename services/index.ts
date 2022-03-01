import { request } from '../util';

export function getPokemons(url: string): Promise<API.Pokemons> {
  return request.get(url);
}

export function getPokemon(url: string): Promise<API.Pokemon> {
  return request.get(url);
}
