import {
  NEW_TEXT,
  SET_HOVER,
  TICK,
  SET_COLOR,
  INCREMENT_RENDER_COUNT
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
    letter
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
