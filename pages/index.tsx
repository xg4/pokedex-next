import type { NextPage } from 'next';
import { dehydrate, QueryClient, useQuery } from 'react-query';
import Card from '../components/card';
import { getPokemonFromUrl, getPokemons } from '../services';

export async function getStaticProps() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery('pokemons', () => getPokemons());
  const result = queryClient.getQueryData<API.Pokemons>('pokemons');

  if (result) {
    await Promise.all(
      result.results.map((pokemon) =>
        queryClient.prefetchQuery(['pokemon', pokemon.url], () => getPokemonFromUrl(pokemon.url)),
      ),
    );
  }
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

const Home: NextPage = () => {
  const { data } = useQuery('pokemons', () => getPokemons());

  return (
    <>
      <header className="sticky top-0 z-50 flex h-10 w-full items-center justify-center bg-red-500">
        <div className="container mx-auto flex items-center justify-center">
          <h1 className="text-3xl text-white">Pok&#xE9;</h1>
        </div>
      </header>
      <div className="container mx-auto flex flex-wrap justify-around p-6">
        {data?.results.map((pokemon) => (
          <Card key={pokemon.url} pokemon={pokemon} />
        ))}
      </div>
    </>
  );
};

export default Home;
