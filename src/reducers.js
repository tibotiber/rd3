import { NEW_TEXT, SET_HOVER } from './constants'

const defaultState = {
  text: {},
  colors: {
    user1: 'blue',
    user2: 'orange'
  },
  hover: null
}

function newText (state, action) {
  let s = Object.assign({}, state)
  Object.keys(action.text).forEach(user => {
    s.text[user] = action.text[user]
  })
  return s
}

function setHover (state, action) {
  return Object.assign({}, state, {
    hover: action.letter
  })
}

function rootReducer (state = defaultState, action) {
  switch (action.type) {
    case NEW_TEXT:
      return newText(state, action)
    case SET_HOVER:
      return setHover(state, action)
    default:
      return state
  }
}

export default rootReducer
