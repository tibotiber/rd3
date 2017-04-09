import { NEW_TEXT } from './constants'

export function newText (text) {
  return {
    type: NEW_TEXT,
    text
  }
}
