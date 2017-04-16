import {fromJS} from 'immutable'
import {NEW_TEXT, SET_HOVER, TICK, SET_COLOR} from './constants'

const defaultState = {
  text: {},
  colors: {
    user1: 'blue',
    user2: 'orange'
  },
  hover: null,
  tick: 0,
  pallet: ['blue', 'green', 'grey', 'orange', 'purple', 'red']
}

function newText (state, action) {
  const text = fromJS(state.text)
  const newText = text.mergeDeep(action.text).toJS()
  return Object.assign({}, state, {
    text: newText
  })
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

function setColor (state, action) {
  const colors = fromJS(state.colors)
  const newColors = colors.mergeDeep({[action.user]: action.color}).toJS()
  return Object.assign({}, state, {
    colors: newColors
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
    case SET_COLOR:
      return setColor(state, action)
    default:
      return state
  }
}

export default rootReducer
