import {connect} from 'react-redux'
import Dashboard from 'components/Dashboard'
import {incrementRenderCount} from 'redux/actions'
import toJS from 'hocs/toJS'
import {getHover, getSaturatedColors} from 'redux/selectors'

const mapStateToProps = (state, ownProps) => ({
  hover: getHover(state),
  colors: getSaturatedColors(state)
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  incrementRenderCount (mode) {
    dispatch(incrementRenderCount('dashboard', mode))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(toJS(Dashboard))
