import {connect} from 'react-redux'
import toJS from 'toJS'
import Ticker from 'components/Ticker'

const mapStateToProps = (state, ownProps) => ({
  tick: state.get('tick'),
  renderCount: state.get('renderCount')
})

export default connect(mapStateToProps)(toJS(Ticker))
