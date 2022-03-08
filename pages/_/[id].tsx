import compact from 'lodash/fp/compact';
import defaultTo from 'lodash/fp/defaultTo';
import filter from 'lodash/fp/filter';
import find from 'lodash/fp/find';
import get from 'lodash/fp/get';
import head from 'lodash/fp/head';
import last from 'lodash/fp/last';
import map from 'lodash/fp/map';
import pipe from 'lodash/fp/pipe';
import shuffle from 'lodash/fp/shuffle';
import toString from 'lodash/fp/toString';
import words from 'lodash/fp/words';
import isString from 'lodash/isString';
import startCase from 'lodash/startCase';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import Ability from '../../components/Ability';
import { getPokemonById, getPokemonSpeciesById } from '../../services';
import { FlavorText, Name } from '../../types';
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

  const name: Name | undefined = pipe(find((i: Name) => i.language.name == 'zh-Hans'))(species?.names);

  const types = data?.types || [];
  const color = getColorByPokemonTypeMemoized(head(types)?.type.name);

  const genderPercentage = species && species.gender_rate !== -1 ? (species.gender_rate / 8) * 100 : -1;

  const profiles = [
    {
      name: '高度',
      value: `${pipe(toString, parseFloat)(data.height / 10).toFixed(2)} m`,
    },
    {
      name: '宽度',
      value: `${pipe(toString, parseFloat)(data.weight / 10).toFixed(2)} kg`,
    },
    {
      name: '性别比例',
      value: genderPercentage == -1 ? '无性别' : `${100 - genderPercentage}%♂︎ ${genderPercentage}%♀︎`,
    },
    {
      name: '技能',
      value: data.abilities.map((item) => {
        const id = pipe(words, last)(item.ability.url);
        return id ? <Ability key={item.ability.url} isHidden={item.is_hidden} id={id} /> : null;
      }),
    },
  ];

  const flavorText: FlavorText | undefined = pipe(
    filter((i: FlavorText) => i.language.name === 'zh-Hans'),
    shuffle,
    head,
  )(species?.flavor_text_entries);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto overflow-hidden rounded-xl bg-white shadow-lg">
        <div style={{ backgroundColor: color }} className="flex flex-col items-start justify-center bg-red-500 p-5">
          <span className="text-md font-medium text-white">#{data.id}</span>
          <h1 className="text-2xl text-white">{startCase(data?.name)}</h1>
          <div className="z-10 flex w-full items-center justify-center">
            <Image alt={data.name} width={200} height={200} src={image} />
          </div>
        </div>

        <div className="-translate-y-10 rounded-xl bg-white px-5 pt-10">
          <div className="mb-2 text-lg font-semibold">{name?.name}</div>
          <div className="mb-5 text-gray-500">{flavorText?.flavor_text}</div>
          <ul className="flex flex-col flex-wrap">
            {profiles.map((item) => (
              <li className="flex items-center" key={item.name}>
                <div className="flex-1 font-medium text-gray-400">{item.name}</div>
                <div className="flex-1">{item.value}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
