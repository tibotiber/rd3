import {connect} from 'react-redux'
import {createSelector} from 'reselect'
import Dashboard from '../components/Dashboard'
import {getColorWithDefaultSaturation} from '../utils/colors'
import {incrementRenderCount} from '../actions'
import toJS from '../toJS'

const getColors = state => state.get('colors')

const selectColors = createSelector(getColors, colors => {
  return colors.map(color => getColorWithDefaultSaturation(color))
})

const mapStateToProps = (state, ownProps) => {
  return {
    hover: state.get('hover'),
    colors: selectColors(state)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    incrementRenderCount: mode =>
      dispatch(incrementRenderCount('dashboard', mode))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  toJS(Dashboard)
)
