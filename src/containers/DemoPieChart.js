import {connect} from 'react-redux'
import {createSelector} from 'reselect'
import DemoPieChart from '../components/DemoPieChart'
import {countLetters} from '../utils/stringStats'
import {incrementRenderCount} from '../actions'
import toJS from '../toJS'

const getText = state => state.get('text')

const selectData = createSelector(getText, text => {
  return text.reduce((result, userText, user) => {
    const nbOfLetters = countLetters(userText)
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
    data: selectData(state)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    incrementRenderCount: mode =>
      dispatch(incrementRenderCount('piechart', mode))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(toJS(DemoPieChart))
