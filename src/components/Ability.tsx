import { useQuery } from '@tanstack/react-query'
import { getAbilityById } from '../services'

interface Props {
  id: string
  isHidden: boolean
}

export default function Ability({ id, isHidden }: Props) {
  const { data } = useQuery({
    queryKey: ['ability', id],
    queryFn() {
      return getAbilityById(id)
    },
  })

  const name = data?.names.find(i => i.language.name === 'zh-Hans')

  return (
    <div>
      {name?.name ?? data?.name}
      {isHidden ? <span className="text-xs text-gray-500"> (隐藏技能)</span> : null}
    </div>
  )
}
