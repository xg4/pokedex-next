'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import divide from 'lodash/divide'
import { useEffect, useRef } from 'react'
import { useIntersection } from 'react-use'
import Card from '../components/Card'
import { getPokemonList } from '../services'

// export async function getStaticProps() {
//   const queryClient = new QueryClient();

//   await queryClient.prefetchQuery('pokemons', () => getPokemons(initUrl));
//   const result = queryClient.getQueryData<API.Pokemons>('pokemons');

//   if (result) {
//     await Promise.all(
//       result.results.map((pokemon) =>
//         queryClient.prefetchQuery(['pokemon', pokemon.url], () => getPokemon(pokemon.url)),
//       ),
//     );
//   }
//   return {
//     props: {
//       dehydratedState: dehydrate(queryClient),
//     },
//   };
// }

export default function Page() {
  const intersectionRef = useRef(null)
  const intersection = useIntersection(intersectionRef, {
    root: null,
    rootMargin: '0px',
    threshold: 1,
  })

  const { data, hasNextPage, fetchNextPage, isFetching, isFetchedAfterMount } = useInfiniteQuery({
    queryKey: ['pokemons'],
    queryFn({ pageParam }) {
      return getPokemonList(pageParam)
    },
    getNextPageParam(lastPage, pages) {
      if (lastPage.next) {
        const searchParams = new URL(lastPage.next).searchParams
        const limit = searchParams.get('limit')
        const offset = searchParams.get('offset')
        if (!offset || !limit) {
          return
        }
        return divide(parseInt(offset), parseInt(limit)) + 1
      }
      return
    },
    initialPageParam: 1,
  })

  useEffect(() => {
    if (hasNextPage && intersection?.isIntersecting && isFetchedAfterMount) {
      fetchNextPage()
    }
  }, [intersection, hasNextPage, isFetchedAfterMount, fetchNextPage])

  const list = data?.pages.flatMap(item => item.results)

  return (
    <>
      <header className="flex w-full flex-col items-center justify-center p-10">
        <img className="w-60 object-contain" src="/images/logo.png" alt="" />
        <h1 className="font-mono text-3xl text-gray-600">宝可梦</h1>
      </header>
      <section className="flex justify-center">
        <div className="flex flex-wrap justify-center gap-10 p-6">
          {list?.map(pokemon => <Card key={pokemon.url} pokemon={pokemon} />)}
        </div>
      </section>
      <div className="flex items-center justify-center p-5">
        <button
          ref={intersectionRef}
          disabled={isFetching}
          onClick={() => {
            fetchNextPage()
          }}
          className="text-red-500"
        >
          {isFetching ? '加载中...' : '加载更多'}
        </button>
      </div>
    </>
  )
}
