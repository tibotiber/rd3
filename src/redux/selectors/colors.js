import {createSelector} from 'reselect'
import {getColorWithDefaultSaturation} from 'utils/colors'

const getColors = state => state

export const getSaturatedColors = createSelector(getColors, colors => {
  return colors.map(color => getColorWithDefaultSaturation(color))
})

export const getSaturatedColorsArray = createSelector(
  getSaturatedColors,
  colors => {
    return colors.sortBy((v, k) => k).valueSeq()
  }
)
