'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import ky from 'ky'
import PokeAPI from 'pokedex-promise-v2'
import { useEffect, useRef } from 'react'
import { useIntersection } from 'react-use'
import Card from '../components/Card'

export default function Page() {
  const intersectionRef = useRef(null)
  const intersection = useIntersection(intersectionRef, {
    root: null,
    rootMargin: '0px',
    threshold: 1,
  })

  const { data, hasNextPage, fetchNextPage, isFetching, isFetchedAfterMount } = useInfiniteQuery({
    queryKey: ['pokemon-list'],
    queryFn: ({ pageParam }) => ky.get(pageParam).json<PokeAPI.NamedAPIResourceList>(),
    getNextPageParam: lastPage => lastPage.next,
    initialPageParam: 'https://pokeapi.co/api/v2/pokemon?limit=20&offset=0',
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
          {list?.map(pokemon => <Card key={pokemon.url} url={pokemon.url} />)}
        </div>
      </section>
      <div className="flex items-center justify-center p-5">
        <button
          ref={intersectionRef}
          disabled={isFetching}
          onClick={() => {
            fetchNextPage()
          }}
          className="text-gray-500"
        >
          {isFetching ? '加载中...' : '加载更多'}
        </button>
      </div>
    </>
  )
}
