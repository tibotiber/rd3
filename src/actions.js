import {NEW_TEXT, SET_HOVER} from './constants'

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
