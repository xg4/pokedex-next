import classNames from 'classnames';
import last from 'lodash/fp/last';
import pipe from 'lodash/fp/pipe';
import words from 'lodash/fp/words';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from 'react-query';
import pokeball from '../public/images/pokeball.png';
import { getPokemonFromUrl } from '../services';
import { randomColors } from '../util';

export default function Card({ pokemon }: { pokemon: API.Species }) {
  const { data } = useQuery(['pokemon', pokemon.url], () => getPokemonFromUrl(pokemon.url));

  if (!data) {
    return null;
  }

  const color = randomColors(pokemon.name);

  const id = pipe(words, last)(pokemon.url);

  return (
    <Link href={`/pokemon?url=${encodeURIComponent(pokemon.url)}`}>
      <a
        style={{
          backgroundColor: randomColors(pokemon.name),
        }}
        className={classNames(
          'group flex flex-col items-center justify-center overflow-hidden',
          'mx-3 mb-5 w-60 text-xs',
          'rounded-lg shadow-lg hover:shadow-2xl',
          'transition-all duration-200 ease-in-out hover:-translate-y-2',
        )}
      >
        <div className="relative flex w-full items-center justify-center pt-20">
          <div
            className={classNames(
              'absolute top-5 left-5',
              'pointer-events-none text-3xl font-semibold text-black text-opacity-25',
            )}
          >
            #{id}
          </div>

          <div
            style={{ width: 80, height: 80 }}
            className={classNames(
              'absolute top-1/2 left-1/2 z-0 -translate-x-1/2 -translate-y-1/2',
              'rounded-full bg-white opacity-20',
              'transition-transform duration-300 ease-in-out group-hover:rotate-180',
            )}
          >
            <Image width={80} height={80} alt="pokeball" src={pokeball}></Image>
          </div>

          <Image
            alt={pokemon.name}
            width={100}
            height={100}
            src={data.sprites.other?.dream_world.front_default || data.sprites.front_default}
          ></Image>
        </div>
        <div className="flex w-full flex-col items-center justify-center bg-white pt-5 pb-8">
          <h3 style={{ color }} className="mb-2 text-3xl font-semibold capitalize">
            {pokemon.name}
          </h3>
          <div>
            {data.types.map(({ type }) => {
              const color = randomColors(type.name);
              return (
                <span
                  key={type.url}
                  style={{ color }}
                  className={classNames('mx-3 text-sm font-bold uppercase text-gray-300')}
                >
                  {type.name}
                </span>
              );
            })}
          </div>
        </div>
      </a>
    </Link>
  );
}
