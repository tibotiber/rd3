import {combineReducers} from 'redux-immutable'
import {fromJS} from 'immutable'
import text from 'redux/reducers/text'
import colors from 'redux/reducers/colors'
import hover from 'redux/reducers/hover'
import tick from 'redux/reducers/tick'
import renderCount from 'redux/reducers/renderCount'
import piechartFilterEnabled from 'redux/reducers/piechartFilterEnabled'
import theme from 'redux/reducers/theme'

export const initialState = fromJS({
  text: {},
  colors: {
    user1: 'blue',
    user2: 'orange'
  },
  hover: null,
  tick: 0,
  renderCount: {},
  piechartFilterEnabled: true,
  theme: 'dark'
})

export default combineReducers(
  {text, colors, hover, tick, renderCount, piechartFilterEnabled, theme},
  initialState
)
