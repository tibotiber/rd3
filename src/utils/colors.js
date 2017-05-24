import * as d3Chroma from 'd3-scale-chromatic'
import _ from 'lodash'
import {DEFAULT_SATURATION} from '../constants'

export const getColorWithDefaultSaturation = colorName => {
  return d3Chroma[`interpolate${_.capitalize(colorName)}s`](DEFAULT_SATURATION)
}
