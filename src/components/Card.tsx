import { useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import { compact, defaultTo, get, head, map, pipe } from 'lodash/fp'
import Link from 'next/link'
import { ZERO_IMAGE } from '../constants'
import { getColorByPokemonTypeMemoized, getIdByUrl } from '../helpers'
import { getPokemonById } from '../services'
import { Item } from '../types'
import Name from './Name'

function Pokeball() {
  return (
    <div
      style={{ width: 80, height: 80 }}
      className={classNames(
        'absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2',
        'rounded-full bg-white opacity-20',
        'transition-transform duration-300 ease-out group-hover:rotate-180',
      )}
    >
      <img alt="pokeball" src="/images/pokeball.png" className="h-20 w-20 object-contain" />
    </div>
  )
}

export default function Card({ pokemon, className }: { pokemon: Item; className?: string }) {
  const id = getIdByUrl(pokemon.url)
  const { data, isLoading } = useQuery({
    queryKey: ['pokemon', id],
    queryFn: () => getPokemonById(id!),
  })

  const imageKeys = [
    'other.dream_world.front_default',
    'other.home.front_default',
    'other.official-artwork.front_default',
    'front_default',
  ]
  const image: string = pipe(
    map((path: string) => get(path)(data?.sprites)),
    compact,
    head,
    defaultTo(ZERO_IMAGE),
  )(imageKeys)

  const types = data?.types || []
  const color = getColorByPokemonTypeMemoized(types[0]?.type.name)
  return (
    <Link
      href={`/${id}`}
      style={{
        backgroundColor: color,
      }}
      className={classNames(
        className,
        'group flex flex-col items-center justify-center overflow-hidden',
        'w-60 pb-10 text-xs',
        'rounded-lg shadow-lg hover:shadow-2xl',
        'transition-all duration-200 ease-in-out hover:-translate-y-2',
        { 'blur-sm': isLoading },
      )}
    >
      <div className="relative flex w-full items-center justify-center pt-20">
        <div
          className={classNames(
            'absolute left-5 top-5',
            'pointer-events-none text-3xl font-semibold text-black text-opacity-25',
          )}
        >
          #{id}
        </div>

        <Pokeball />

        <div className="z-10">
          <img alt={pokemon.name} src={image} className="h-24 w-24 object-contain" />
        </div>
      </div>
      <div className="relative w-full">
        <div className="absolute inset-0 bg-white/60 blur-xl"></div>
        <div
          className={classNames(
            'relative z-50 flex w-full flex-col items-center justify-center',
            'bg-transparent pb-8 pt-5',
          )}
        >
          <h3 className="mb-2 w-full truncate break-words px-2 text-center text-3xl font-semibold text-gray-600">
            <Name id={id} />
          </h3>
          <div>
            {types.map(({ type }) => {
              const color = getColorByPokemonTypeMemoized(type.name)
              return (
                <span
                  key={type.url}
                  style={{ color }}
                  className={classNames('mx-3 text-sm font-bold uppercase text-gray-300')}
                >
                  {type.name}
                </span>
              )
            })}
          </div>
        </div>
      </div>
    </Link>
  )
}
