import {SET_COLOR} from 'redux/constants'

const setColor = (state, action) => {
  return state.set(action.user, action.color)
}

const colorReducer = (state, action) => {
  switch (action.type) {
    case SET_COLOR:
      return setColor(state, action)
    default:
      return state
  }
}

export default colorReducer
