import {SELECT_THEME} from 'redux/constants'

const selectTheme = (state, action) => {
  return action.theme
}

const themeReducer = (state, action) => {
  switch (action.type) {
    case SELECT_THEME:
      return selectTheme(state, action)
    default:
      return state
  }
}
export default themeReducer
