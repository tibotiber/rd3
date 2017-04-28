import {connect} from 'react-redux'
import {createSelector} from 'reselect'
import DemoPieChart from '../components/DemoPieChart'
import {countLetters} from '../utils/stringStats'
import {incrementRenderCount, piechartToggleFilter} from '../actions'
import toJS from '../toJS'

const getText = state => state.get('text')
const getHover = state => state.get('hover')
const getFilterEnabled = state => state.get('piechartFilterEnabled')

const selectHover = createSelector(
  [getHover, getFilterEnabled],
  (hover, filter) => {
    return filter ? hover : null
  }
)

const selectData = createSelector([getText, selectHover], (text, hover) => {
  return text.reduce((result, userText, user) => {
    const nbOfLetters = countLetters(userText, hover ? hover.toJS() : null)
    if (nbOfLetters > 0) {
      result.push({
        name: user,
        value: nbOfLetters
      })
    }
    return result
  }, [])
})

const mapStateToProps = (state, ownProps) => {
  return {
    data: selectData(state),
    hover: selectHover(state),
    filter: state.get('piechartFilterEnabled')
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    incrementRenderCount: mode =>
      dispatch(incrementRenderCount('piechart', mode)),
    toggleFilter: () => dispatch(piechartToggleFilter())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(toJS(DemoPieChart))
