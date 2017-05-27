import {PIECHART_TOGGLE_FILTER} from 'redux/constants'

const piechartToggleFilter = (state, action) => {
  return !state
}

const piechartFilterEnabledReducer = (state, action) => {
  switch (action.type) {
    case PIECHART_TOGGLE_FILTER:
      return piechartToggleFilter(state, action)
    default:
      return state
  }
}

export default piechartFilterEnabledReducer
