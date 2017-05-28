import {connect} from 'react-redux'
import toJS from 'hocs/toJS'
import Ticker from 'components/Ticker'
import {getTick, getRenderCount} from 'redux/selectors'

const mapStateToProps = (state, ownProps) => ({
  tick: getTick(state),
  renderCount: getRenderCount(state)
})

export default connect(mapStateToProps)(toJS(Ticker))
