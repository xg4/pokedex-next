import classNames from 'classnames';
import last from 'lodash/fp/last';
import pipe from 'lodash/fp/pipe';
import words from 'lodash/fp/words';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from 'react-query';
import { getPokemonFromUrl } from '../services';
import { randomColors } from '../util';

export default function Card({ pokemon }: { pokemon: API.Species }) {
  const { data } = useQuery(['pokemon', pokemon.url], () => getPokemonFromUrl(pokemon.url), { enabled: !!pokemon.url });

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
          'flex justify-center items-center flex-col overflow-hidden',
          'w-60 mx-2 mb-3 text-xs',
          'shadow-lg rounded-lg hover:shadow-2xl',
          'transition-all duration-200 ease-in-out hover:-translate-y-2',
        )}
      >
        <div className="w-full relative flex items-center pt-20 justify-center">
          <div
            className={classNames(
              'absolute top-5 left-5',
              'text-3xl font-semibold text-black text-opacity-25 pointer-events-none',
            )}
          >
            #{id}
          </div>

          <div
            style={{ width: 80, height: 80 }}
            className={classNames(
              'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0',
              'rounded-full inset-x-auto mx-auto bg-white opacity-40',
            )}
          ></div>
          <Image
            alt={pokemon.name}
            width={100}
            height={100}
            src={data.sprites.other?.dream_world.front_default || data.sprites.front_default}
          ></Image>
        </div>
        <div className="w-full bg-white flex justify-center flex-col items-center pt-5 pb-8">
          <h3 style={{ color }} className="capitalize font-semibold text-3xl mb-2">
            {pokemon.name}
          </h3>
          <div>
            {data.types.map(({ type }) => {
              const color = randomColors(type.name);
              return (
                <span
                  key={type.url}
                  style={{ color }}
                  className={classNames('font-bold uppercase text-sm mx-3 text-gray-300')}
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
