import {TICK} from 'redux/constants'

const incrementTick = (state, action) => {
  return state + 1
}

const tickReducer = (state, action) => {
  switch (action.type) {
    case TICK:
      return incrementTick(state, action)
    default:
      return state
  }
}

export default tickReducer
