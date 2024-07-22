import { getIdByUrl } from '@/helpers'
import { getSpeciesById } from '@/services'
import { useQuery } from '@tanstack/react-query'

interface Props {
  id: string
  className?: string
}

export default function Name({ id, className }: Props) {
  const { data } = useQuery({
    queryKey: ['pokemon-species', id],
    queryFn() {
      return getSpeciesById(id!)
    },
    enabled: !!id,
  })

  const name = data?.names.find(i => i.language.name == 'zh-Hans')

  if (!name) {
    return null
  }

  return <div className={className}>{name.name}</div>
}
