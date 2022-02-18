import type { NextPage } from 'next';
import Head from 'next/head';
import { dehydrate, QueryClient, useQuery } from 'react-query';
import Card from '../components/card';
import { getPokemons } from '../services';

export async function getStaticProps() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery('pokemons', () => getPokemons());

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
      <header className="w-full h-10 sticky z-50 bg-red-500 top-0 flex justify-center items-center">
        <div className="container mx-auto flex justify-center items-center">
          <h1 className="text-white text-3xl">Pok&#xE9;</h1>
        </div>
      </header>
      <div className="container mx-auto flex flex-wrap p-6 justify-center">
        {data?.results.map((pokemon) => (
          <Card key={pokemon.url} pokemon={pokemon} />
        ))}
      </div>
    </>
  );
};

export default Home;
