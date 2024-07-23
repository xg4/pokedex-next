import { pokedex } from '@/services'
import Card from '../components/Card'

export default async function Page() {
  const data = await pokedex.getPokemonsList({
    limit: 10000,
    offset: 0,
  })

  return (
    <>
      <header className="flex w-full flex-col items-center justify-center p-10">
        <img className="w-60 object-contain" src="/images/logo.png" alt="" />
        <h1 className="font-mono text-3xl text-gray-600">宝可梦</h1>
      </header>
      <section className="flex justify-center">
        <div className="flex flex-wrap justify-center gap-10 p-6">
          {data.results.map(pokemon => (
            <Card key={pokemon.url} url={pokemon.url} />
          ))}
        </div>
      </section>
    </>
  )
}
