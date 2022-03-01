import flatMap from 'lodash/flatMap';
import random from 'lodash/random';
import type { NextPage } from 'next';
import { useEffect, useRef } from 'react';
import { dehydrate, QueryClient, useInfiniteQuery } from 'react-query';
import { useIntersection } from 'react-use';
import Card from '../components/card';
import { getPokemons } from '../services';

const initUrl = `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${random(0, 1000)}`;

export async function getStaticProps() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery('pokemons', () => getPokemons(initUrl));
  // const result = queryClient.getQueryData<API.Pokemons>('pokemons');

  // if (result) {
  //   await Promise.all(
  //     result.results.map((pokemon) =>
  //       queryClient.prefetchQuery(['pokemon', pokemon.url], () => getPokemon(pokemon.url)),
  //     ),
  //   );
  // }
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

const Home: NextPage = () => {
  const intersectionRef = useRef(null);
  const intersection = useIntersection(intersectionRef, {
    root: null,
    rootMargin: '0px',
    threshold: 1,
  });

  const { data, hasNextPage, fetchNextPage, isFetching, isFetchedAfterMount } = useInfiniteQuery(
    'pokemons',
    ({ pageParam = initUrl }) => getPokemons(pageParam),
    {
      getNextPageParam: (lastPage) => lastPage.next,
    },
  );

  useEffect(() => {
    if (hasNextPage && intersection?.isIntersecting && isFetchedAfterMount) {
      fetchNextPage();
    }
  }, [intersection, hasNextPage, isFetchedAfterMount]);

  const list = flatMap(data?.pages, (item) => item.results);

  return (
    <>
      <header className="sticky top-0 z-50 flex h-10 w-full items-center justify-center bg-red-500">
        <div className="container mx-auto flex items-center justify-center">
          <h1 className="text-3xl text-white">Pok&#xE9;</h1>
        </div>
      </header>
      <div className="container mx-auto flex flex-wrap justify-around p-6">
        {list.map((pokemon) => (
          <Card key={pokemon.url} pokemon={pokemon} />
        ))}
      </div>
      <div className="flex items-center justify-center p-5">
        <button
          ref={intersectionRef}
          disabled={isFetching}
          onClick={() => {
            fetchNextPage();
          }}
          className="text-green-500"
        >
          {isFetching ? '加载中...' : '加载更多'}
        </button>
      </div>
    </>
  );
};

export default Home;
