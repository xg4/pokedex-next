import compact from 'lodash/fp/compact';
import defaultTo from 'lodash/fp/defaultTo';
import get from 'lodash/fp/get';
import head from 'lodash/fp/head';
import map from 'lodash/fp/map';
import pipe from 'lodash/fp/pipe';
import toString from 'lodash/fp/toString';
import isString from 'lodash/isString';
import startCase from 'lodash/startCase';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { getPokemonById, getPokemonSpeciesById } from '../../services';
import { FlavorText } from '../../types';
import { getColorByPokemonTypeMemoized } from '../../util';

const ZERO_IMAGE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/0.png';

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const { url } = context.query;

//   if (!isPokemonUrl(url)) {
//     return {
//       notFound: true,
//     };
//   }

//   const queryClient = new QueryClient();

//   await queryClient.prefetchQuery(['pokemon', url], () => getPokemon(url));

//   return {
//     props: {
//       dehydratedState: dehydrate(queryClient),
//     },
//   };
// };

export default function Pokemon() {
  const router = useRouter();
  const _id = router.query.id;
  const id = isString(_id) ? _id : '';

  const { data } = useQuery(['pokemon', id], () => getPokemonById(id), { enabled: !!id });

  const { data: species } = useQuery(['pokemonSpecies', id], () => getPokemonSpeciesById(id), { enabled: !!id });

  const imageKeys = [
    'other.dream_world.front_default',
    'other.home.front_default',
    'other.official-artwork.front_default',
    'front_default',
  ];
  const image: string = pipe(
    map(get),
    map((_get: any) => _get(data?.sprites)),
    compact,
    head,
    defaultTo(ZERO_IMAGE),
  )(imageKeys);

  if (!data) {
    return null;
  }

  const types = data?.types || [];
  const color = getColorByPokemonTypeMemoized(types[0]?.type.name);

  const genderPercentage = species && species.gender_rate !== -1 ? (species.gender_rate / 8) * 100 : -1;

  const profiles = [
    {
      name: 'Height',
      value: `${pipe(toString, parseFloat)(data.height / 10).toFixed(2)}m`,
    },
    {
      name: 'Weight',
      value: `${pipe(toString, parseFloat)(data.weight / 10).toFixed(2)}kg`,
    },
    {
      name: 'Gender',
      value: genderPercentage == -1 ? 'Genderless' : `${100 - genderPercentage}% ${genderPercentage}%`,
    },
    {
      name: 'Abilities',
      value: data.abilities.map((item) => (
        <div key={item.ability.url}>
          {startCase(item.ability.name)}
          {item.is_hidden ? <span className="text-xs text-gray-500">(hidden abilities)</span> : null}
        </div>
      )),
    },
  ];

  const flavorText = species?.flavor_text_entries.find((i: FlavorText) => i.language.name === 'zh-Hans');

  return (
    <div className="bg-gray-100">
      <div className="container mx-auto overflow-hidden rounded-xl bg-white shadow-lg">
        <div style={{ backgroundColor: color }} className="flex flex-col items-start justify-center bg-red-500 p-5">
          <span className="text-md font-medium text-white">#{data.id}</span>
          <h1 className="text-2xl text-white">{startCase(data?.name)}</h1>
          <div className="z-10 flex w-full items-center justify-center">
            <Image alt={data.name} width={200} height={200} src={image} />
          </div>
        </div>

        <div className="-translate-y-10 rounded-xl bg-white px-5 pt-10">
          <div className="mb-2 text-lg font-semibold">Pokémon Data</div>
          <div className="mb-5 text-gray-500">{flavorText?.flavor_text}</div>
          <ul className="flex flex-col flex-wrap">
            {profiles.map((item) => (
              <li className="mb-2 flex" key={item.name}>
                <span className="flex-1 font-medium text-gray-400">{item.name}</span>
                <span className="flex-1">{item.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
