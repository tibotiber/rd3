import {connect} from 'react-redux'
import toJS from 'hocs/toJS'
import Ticker from 'components/Ticker'
import {getTick, getRenderCount} from 'redux/selectors'
import {tick} from 'redux/actions'

const mapStateToProps = (state, ownProps) => ({
  tickValue: getTick(state),
  renderCount: getRenderCount(state)
})

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    tick: () => {
      dispatch(tick())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(toJS(Ticker))
