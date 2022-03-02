import get from 'lodash/get';
import lowerCase from 'lodash/lowerCase';
import memoize from 'lodash/memoize';
import { POKEMON_TYPE_COLORS } from '../config/colors';

const getColorByPokemonType = (type: string = 'normal') => get(POKEMON_TYPE_COLORS, lowerCase(type));

export const getColorByPokemonTypeMemoized = memoize(getColorByPokemonType);
