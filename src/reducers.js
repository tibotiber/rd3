import { NEW_TEXT } from './constants'

const defaultState = {
  text: {},
  colors: {
    user1: 'blue',
    user2: 'orange'
  }
}

function newText (state, action) {
  let s = Object.assign({}, state)
  Object.keys(action.text).forEach(user => {
    s.text[user] = action.text[user]
  })
  return s
}

function rootReducer (state = defaultState, action) {
  switch (action.type) {
    case NEW_TEXT:
      return newText(state, action)
    default:
      return state
  }
}

export default rootReducer
