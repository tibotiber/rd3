import {INCREMENT_RENDER_COUNT} from 'redux/constants'

const incrementRenderCount = (state, action) => {
  return state.updateIn(
    [action.component, action.mode],
    (value = 0) => value + 1
  )
}

const renderCountReducer = (state, action) => {
  switch (action.type) {
    case INCREMENT_RENDER_COUNT:
      return incrementRenderCount(state, action)
    default:
      return state
  }
}

export default renderCountReducer
