'use client'

import { useQuery } from '@tanstack/react-query'
import ky from 'ky'
import PokeAPI from 'pokedex-promise-v2'

interface Props {
  url: string
  isHidden: boolean
}

export default function Ability({ url, isHidden }: Props) {
  const { data } = useQuery({
    queryKey: ['ability', url],
    queryFn: () => ky.get(url).json<PokeAPI.Ability>(),
  })

  if (!data) {
    return
  }

  const name = data?.names.find(i => i.language.name === 'zh-Hans')

  return (
    <div>
      {name?.name}
      {isHidden ? <span className="text-xs text-gray-500"> (隐藏技能)</span> : null}
    </div>
  )
}
