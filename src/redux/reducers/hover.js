import {fromJS} from 'immutable'
import {SET_HOVER} from 'redux/constants'

const setHover = (state, action) => {
  return fromJS(action.letters)
}

const hoverReducer = (state, action) => {
  switch (action.type) {
    case SET_HOVER:
      return setHover(state, action)
    default:
      return state
  }
}

export default hoverReducer
