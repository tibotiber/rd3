import {NEW_TEXT, SET_HOVER, TICK} from './constants'

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
