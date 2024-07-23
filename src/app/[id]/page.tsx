import Progress from '@/components/Progress'
import { STATS_COLORS } from '@/constants/colors'
import { get, shuffle } from 'lodash'
import { pipe, toString } from 'lodash/fp'
import { getColorByType, getImageBySprites } from '../../helpers'
import { pokedex } from '../../services'

export default async function Pokemon({ params: { id } }: { params: { id: string } }) {
  const [pokemon] = await Promise.all([pokedex.getPokemonByName(id)])
  const [species, abilities, stats] = await Promise.all([
    pokedex.getPokemonSpeciesByName(id),
    Promise.all(pokemon.abilities.map(i => pokedex.getAbilityByName(i.ability.name))),
    Promise.all(pokemon.stats.map(i => pokedex.getStatByName(i.stat.name))),
  ])

  const image = getImageBySprites(pokemon.sprites)

  const [color] = getColorByType(pokemon.types.filter(i => i.type.name !== 'normal').map(t => t.type.name))

  const genderPercentage = species && species.gender_rate !== -1 ? (species.gender_rate / 8) * 100 : -1

  const profiles = [
    {
      name: '高度',
      value: `${pipe(toString, parseFloat)(pokemon.height / 10).toFixed(2)} m`,
    },
    {
      name: '宽度',
      value: `${pipe(toString, parseFloat)(pokemon.weight / 10).toFixed(2)} kg`,
    },
    {
      name: '性别比例',
      value:
        genderPercentage == -1 ? (
          '无性别'
        ) : (
          <>
            <span className="text-blue-400">{100 - genderPercentage}%♂︎</span>
            <span className="text-pink-400">{genderPercentage}%♀︎</span>
          </>
        ),
    },
    {
      name: '技能',
      value: abilities.map((item, index) => (
        <div key={item.id}>
          {item.names.find(i => i.language.name === 'zh-Hans')?.name}
          {pokemon.abilities[index].is_hidden ? <span className="text-xs text-gray-400"> (隐藏技能)</span> : null}
        </div>
      )),
    },
  ]

  const flavorText = species.flavor_text_entries.filter(i => i.language.name === 'zh-Hans')
  const text = shuffle(flavorText).at(0)

  const name = species.names.find(i => i.language.name === 'zh-Hans')
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto overflow-hidden rounded-xl bg-white shadow-lg">
        <div style={{ backgroundColor: color }} className="flex flex-col items-start justify-center bg-red-500 p-5">
          <span className="text-md font-medium text-white">#{pokemon.id}</span>
          <h1 className="text-2xl text-white">{name?.name}</h1>
          <div className="z-10 flex w-full items-center justify-center">
            <img className="h-52 w-52 object-contain" alt={pokemon.name} src={image} />
          </div>
        </div>

        <div className="-translate-y-10 space-y-4 rounded-xl bg-white px-5 pt-10">
          <div className="text-gray-500">{text?.flavor_text}</div>
          <ul className="flex flex-col gap-2">
            {profiles.map(item => (
              <li className="flex items-start" key={item.name}>
                <span className="flex-1 font-medium text-gray-400">{item.name}</span>
                <span className="flex-1">{item.value}</span>
              </li>
            ))}
          </ul>
          <ul>
            {stats.map((item, index) => (
              <li key={item.id} className="flex items-center">
                <div className="flex-1 font-medium text-gray-400">
                  {item.names.find(i => i.language.name === 'zh-Hans')?.name}
                </div>
                <div className="flex-1">
                  <Progress
                    className="h-1 w-40"
                    color={get(STATS_COLORS, item.name)}
                    percent={pokemon.stats[index].base_stat / 2}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
