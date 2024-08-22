import { pokedex } from '@/services'
import Link from 'next/link'
import { z } from 'zod'
import Card from '../components/Card'

const pageSize = 20

const schema = z.object({
  page: z.coerce.number().int().min(1).default(1).catch(1),
})

export default async function Page({ searchParams }: { searchParams: { page: string } }) {
  const { page } = schema.parse(searchParams)
  const data = await pokedex.getPokemonsList({
    limit: pageSize,
    offset: (page - 1) * pageSize,
  })

  return (
    <>
      <header className="flex w-full flex-col items-center justify-center p-10">
        <img className="w-60 object-contain" src="/images/logo.png" alt="" />
        <h1 className="font-mono text-3xl text-gray-600">宝可梦</h1>
      </header>
      <section className="flex flex-col justify-center">
        <div className="flex flex-wrap justify-center gap-10 p-6">
          {data.results.map(pokemon => (
            <Card key={pokemon.url} url={pokemon.url} />
          ))}
        </div>
        <div className="flex justify-around p-4">
          {page < 2 ? null : (
            <Link
              href={{
                query: {
                  page: page - 1,
                },
              }}
            >
              上一页
            </Link>
          )}
          <Link
            href={{
              query: {
                page: page + 1,
              },
            }}
          >
            下一页
          </Link>
        </div>
      </section>
    </>
  )
}
