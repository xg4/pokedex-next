'use client'

import { STATS_COLORS } from '@/constants/colors'
import { useQueries, useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import ky from 'ky'
import { get } from 'lodash'
import { useRouter } from 'next/navigation'
import PokeAPI from 'pokedex-promise-v2'
import { useCallback, useRef } from 'react'
import { useIntersection } from 'react-use'
import { getColorByType, getImageBySprites } from '../helpers'
import Progress from './Progress'

function Pokeball() {
  return (
    <div
      className={classNames(
        'absolute left-1/2 top-1/2 z-0 h-20 w-20 -translate-x-1/2 -translate-y-1/2',
        'rounded-full bg-white opacity-20',
        'transition-transform duration-300 ease-out group-hover:rotate-180',
      )}
    >
      <img alt="pokeball" src="/images/pokeball.png" className="h-20 w-20 object-contain" />
    </div>
  )
}

export default function Card({ url, className }: { url: string; className?: string }) {
  const intersectionRef = useRef<HTMLButtonElement>(null)

  const intersection = useIntersection(intersectionRef, {
    root: null,
    rootMargin: '500px',
    threshold: 1,
  })

  const { data: pokemon, isLoading: loading } = useQuery({
    queryKey: ['pokemon', url],
    queryFn: () => ky.get(url).json<PokeAPI.Pokemon>(),
    enabled: !!intersection?.isIntersecting,
  })

  const { data: species, isLoading: loading2 } = useQuery({
    queryKey: ['pokemon-species', pokemon?.species.url],
    queryFn: () => ky.get(pokemon!.species.url).json<PokeAPI.PokemonSpecies>(),
    enabled: !!pokemon && !!intersection?.isIntersecting,
  })

  const typesData = useQueries({
    queries: (pokemon?.types || []).map(i => ({
      queryKey: ['pokemon-type', i.type.url],
      queryFn: () => ky.get(i.type.url).json<PokeAPI.Type>(),
      enabled: !!pokemon,
    })),
  })

  const isLoading = loading || loading2 || typesData.some(i => i.isLoading)

  const router = useRouter()

  const handleClick = useCallback(() => {
    if (!pokemon?.name) {
      return
    }
    router.push(pokemon.name)
  }, [pokemon?.name, router])

  const name = species?.names.find(i => i.language.name === 'zh-Hans')

  const image = getImageBySprites(pokemon?.sprites)

  const types = pokemon?.types || []

  const [color] = getColorByType(types.filter(i => i.type.name !== 'normal').map(i => i.type.name))

  return (
    <button
      ref={intersectionRef}
      onClick={handleClick}
      style={{
        backgroundColor: color,
      }}
      className={classNames(
        className,
        'group relative flex flex-col items-center justify-center overflow-hidden',
        'w-60 pb-10 text-xs',
        'rounded-lg shadow-lg hover:shadow-2xl',
        'transition-all duration-200 ease-in-out hover:-translate-y-2',
        { 'blur-sm': isLoading },
      )}
    >
      {pokemon ? (
        <div className="absolute right-2 top-2 space-y-1 rounded-lg bg-white/60 p-2">
          {pokemon.stats.map(item => (
            <Progress key={item.stat.url} color={get(STATS_COLORS, item.stat.name)} percent={item.base_stat / 2} />
          ))}
        </div>
      ) : null}
      <div className="relative flex w-full items-center justify-center pt-20">
        {pokemon ? (
          <div
            className={classNames(
              'absolute left-5 top-5',
              'pointer-events-none text-3xl font-semibold text-black text-opacity-25',
            )}
          >
            #{pokemon.id}
          </div>
        ) : null}

        <Pokeball />

        <div className="z-10">
          <img alt={name?.name} src={image} className="h-24 w-24 object-contain" />
        </div>
      </div>
      {name ? (
        <div
          className={classNames(
            'relative z-50 flex w-full flex-col items-center justify-center',
            'bg-transparent pb-8 pt-5',
            'bg-white/80 shadow-lg backdrop-blur-2xl',
          )}
        >
          <h3 style={{ color }} className="mb-2 w-full truncate break-words px-2 text-center text-3xl font-semibold">
            {name?.name}
          </h3>
          <ul className="flex flex-wrap justify-center gap-3">
            {typesData.map(item => {
              if (!item.data) {
                return null
              }
              const color = getColorByType(item.data.name)
              const name = item.data.names.find(t => t.language.name === 'zh-Hans')
              return (
                <li
                  key={name?.name}
                  style={{ color }}
                  className={classNames('text-sm font-bold uppercase text-gray-300')}
                >
                  {name?.name}
                </li>
              )
            })}
          </ul>
        </div>
      ) : null}
    </button>
  )
}
