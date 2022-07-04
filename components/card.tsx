import classNames from 'classnames'
import compact from 'lodash/fp/compact'
import defaultTo from 'lodash/fp/defaultTo'
import get from 'lodash/fp/get'
import head from 'lodash/fp/head'
import last from 'lodash/fp/last'
import map from 'lodash/fp/map'
import pipe from 'lodash/fp/pipe'
import words from 'lodash/fp/words'
import startCase from 'lodash/startCase'
import Image from 'next/image'
import Link from 'next/link'
import { useQuery } from 'react-query'
import { ZERO_IMAGE } from '../constants'
import { getColorByPokemonTypeMemoized } from '../helpers'
import pokeball from '../public/images/pokeball.png'
import { getPokemonById } from '../services'
import { Item } from '../types'

function Pokeball() {
  return (
    <div
      style={{ width: 80, height: 80 }}
      className={classNames(
        'absolute top-1/2 left-1/2 z-0 -translate-x-1/2 -translate-y-1/2',
        'rounded-full bg-white opacity-20',
        'transition-transform duration-300 ease-in-out group-hover:rotate-180'
      )}
    >
      <Image width={80} height={80} alt="pokeball" src={pokeball}></Image>
    </div>
  )
}

export default function Card({ pokemon }: { pokemon: Item }) {
  const id = pipe(words, last)(pokemon.url)
  const { data, isLoading } = useQuery(['pokemon', id], () =>
    getPokemonById(id!)
  )

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
    defaultTo(ZERO_IMAGE)
  )(imageKeys)

  const types = data?.types || []
  const color = getColorByPokemonTypeMemoized(types[0]?.type.name)
  return (
    <Link href={`/${id}`}>
      <a
        style={{
          backgroundColor: color,
        }}
        className={classNames(
          'group flex flex-col items-center justify-center overflow-hidden',
          'mx-3 mb-5 w-60 pb-10 text-xs',
          'rounded-lg shadow-lg hover:shadow-2xl',
          'transition-all duration-200 ease-in-out hover:-translate-y-2',
          { 'blur-sm': isLoading }
        )}
      >
        <div className="relative flex w-full items-center justify-center pt-20">
          <div
            className={classNames(
              'absolute top-5 left-5',
              'pointer-events-none text-3xl font-semibold text-black text-opacity-25'
            )}
          >
            #{id}
          </div>

          <Pokeball />

          <div style={{ width: 100, height: 100 }}>
            <Image alt={pokemon.name} width={100} height={100} src={image} />
          </div>
        </div>
        <div className="relative w-full">
          <div
            className={classNames(
              'flex w-full flex-col items-center justify-center',
              'bg-white/75 pt-5 pb-8 backdrop-filter'
            )}
          >
            <h3
              style={{ color }}
              className="mb-2 w-full truncate break-words px-2 text-center text-3xl font-semibold"
            >
              {startCase(pokemon.name)}
            </h3>
            <div>
              {types.map(({ type }) => {
                const color = getColorByPokemonTypeMemoized(type.name)
                return (
                  <span
                    key={type.url}
                    style={{ color }}
                    className={classNames(
                      'mx-3 text-sm font-bold uppercase text-gray-300'
                    )}
                  >
                    {type.name}
                  </span>
                )
              })}
            </div>
          </div>
        </div>
      </a>
    </Link>
  )
}
