import * as fromColors from './colors'
import * as fromText from './text'
import * as fromTheme from './theme'

/** delegated to slice selectors **/
// colors
export const getSaturatedColors = state =>
  fromColors.getSaturatedColors(state.get('colors'))
export const getSaturatedColorsArray = state =>
  fromColors.getSaturatedColorsArray(state.get('colors'))
// text
export const getText = state => fromText.getText(state.get('text'))
export const getUsers = state => fromText.getUsers(state.get('text'))
export const getTexts = state => fromText.getTexts(state.get('text'))
// theme
export const getTheme = state => fromTheme.getTheme(state.get('theme'))

/** top level selectors (simple cases) **/
export const getHover = state => state.get('hover')
export const getRenderCount = state => state.get('renderCount')
export const getTick = state => state.get('tick')
