import get from 'lodash/get'
import lowerCase from 'lodash/lowerCase'
import memoize from 'lodash/memoize'
import { POKEMON_TYPE_COLORS } from '../constants/colors'

function _getColorByType(type?: string): string
function _getColorByType(types: string[]): string[]
function _getColorByType(types: any = 'normal') {
  if (Array.isArray(types)) {
    if (!types.length) {
      return [POKEMON_TYPE_COLORS.normal]
    }
    return types.map(type => _getColorByType(type))
  }

  return (types && get(POKEMON_TYPE_COLORS, lowerCase(types))) || POKEMON_TYPE_COLORS.normal
}

export const getColorByType = memoize(_getColorByType)
