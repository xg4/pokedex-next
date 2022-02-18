import isString from 'lodash/isString';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { dehydrate, QueryClient, useQuery } from 'react-query';
import { getPokemonFromUrl } from '../services';

function isPokemonUrl(url: any): url is string {
  return isString(url) && url.startsWith('https://pokeapi.co/api/v2/pokemon/');
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { url } = context.query;

  if (!isPokemonUrl(url)) {
    return {
      notFound: true,
    };
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(['pokemon', url], () => getPokemonFromUrl(url));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default function Pokemon() {
  const router = useRouter();

  const { url } = router.query;

  const { data } = useQuery(['pokemon', url], () => getPokemonFromUrl(url as string), { enabled: isPokemonUrl(url) });
  return <div>{JSON.stringify(data, null, 2)}</div>;
}
