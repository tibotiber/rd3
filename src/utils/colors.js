import * as d3Chroma from 'd3-scale-chromatic'
import _ from 'lodash'

const DEFAULT_SATURATION = 0.55

export const COLOR_PALLET = ['blue', 'green', 'grey', 'orange', 'purple', 'red']

export const getColorWithDefaultSaturation = colorName => {
  return d3Chroma[`interpolate${_.capitalize(colorName)}s`](DEFAULT_SATURATION)
}
