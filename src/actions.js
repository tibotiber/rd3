import _ from 'lodash'
import {
  NEW_TEXT,
  SET_HOVER,
  TICK,
  SET_COLOR,
  INCREMENT_RENDER_COUNT,
  PIECHART_TOGGLE_FILTER
} from './constants'

export function newText (text) {
  return {
    type: NEW_TEXT,
    text
  }
}

export function setHover (letter) {
  return {
    type: SET_HOVER,
    letters: !letter ? null : Array.isArray(letter) ? _.uniq(letter) : [letter]
  }
}

export function tick () {
  return {
    type: TICK
  }
}

export function setColor (user, color) {
  return {
    type: SET_COLOR,
    user,
    color
  }
}

export function incrementRenderCount (component, mode) {
  return {
    type: INCREMENT_RENDER_COUNT,
    component,
    mode
  }
}

export function piechartToggleFilter () {
  return {
    type: PIECHART_TOGGLE_FILTER
  }
}
