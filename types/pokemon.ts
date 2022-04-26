export interface Result<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export type Item = {
  name: string
  url: string
}

// export type Stat = {
//   base_stat: number;
//   name: string;
//   url: string;
// };

export type Name = {
  name: string
  language: {
    name: string
    url: string
  }
}

export type Ability = {
  name: string
  id: number
  names: Name[]
  flavor_text_entries: FlavorText[]
}

export type PokemonSpecies = {
  id: number
  name: string
  description: string
  image: string
  genera: string
  pokedex_number: string
  base_experience: number
  types: Item[]
  names: Name[]
  height: number
  weight: number
  abilites: Item[]
  gender_rate: number
  egg_groups: Item[]
  flavor_text_entries: FlavorText[]
}

export type FlavorText = {
  flavor_text: string
  language: Item
  version: Item
}

export type PokemonAbility = {
  ability: Item
  is_hidden: boolean
  slot: number
}

export type Sprites = {
  back_default: string
  back_female: string
  back_shiny: string
  back_shiny_female: string
  front_default: string
  front_female: string
  front_shiny: string
  front_shiny_female: string
  other?: Other
  animated?: Sprites
}

export interface Other {
  dream_world: {
    front_default: string
    front_female: null
  }
  home: {
    front_default: string
    front_female: string
    front_shiny: string
    front_shiny_female: string
  }
  'official-artwork': {
    front_default: string
  }
}

export type Move = {
  move: Item
  version_group_details: {
    level_learned_at: number
    move_learn_method: Item
    version_group: Item
  }[]
}

export type Stat = {
  base_stat: number
  effort: number
  stat: Item
}

export interface Pokemon {
  abilities: PokemonAbility[]
  base_experience: number
  forms: Item[]
  height: number
  id: number
  is_default: boolean
  location_area_encounters: string
  moves: Move[]
  name: string
  order: number
  species: Item
  sprites: Sprites
  stats: Stat[]
  types: Type[]
  weight: number
}

export type Type = {
  slot: number
  type: Item
}
