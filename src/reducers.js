import {fromJS} from 'immutable'
import {NEW_TEXT, SET_HOVER, TICK} from './constants'

const defaultState = {
  text: {},
  colors: {
    user1: 'blue',
    user2: 'orange'
  },
  hover: null,
  tick: 0
}

function newText (state, action) {
  let s = fromJS(state)
  return s.mergeDeep({text: action.text}).toJS()
}

function setHover (state, action) {
  return Object.assign({}, state, {
    hover: action.letter
  })
}

function tick (state, action) {
  return Object.assign({}, state, {
    tick: state.tick + 1
  })
}

function rootReducer (state = defaultState, action) {
  switch (action.type) {
    case NEW_TEXT:
      return newText(state, action)
    case SET_HOVER:
      return setHover(state, action)
    case TICK:
      return tick(state, action)
    default:
      return state
  }
}

export default rootReducer
