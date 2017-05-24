import {connect} from 'react-redux'
import {createSelector} from 'reselect'
import DemoScatterPlot from '../components/DemoScatterPlot'
import {countLettersCoOccurrences} from '../utils/stringStats'
import {setHover, incrementRenderCount} from '../actions'
import toJS from '../toJS'

const getText = state => state.get('text')

const selectData = createSelector(getText, text => {
  return text.reduce((result, userText, user) => {
    return result.concat(
      countLettersCoOccurrences(userText).map(o => {
        return {group: user, x: o.letter1, y: o.letter2, n: o.count}
      })
    )
  }, [])
})

const selectGroups = createSelector(getText, text => {
  return text.keySeq()
})

const mapStateToProps = (state, ownProps) => ({
  data: selectData(state),
  groups: selectGroups(state)
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  setHover (letter) {
    dispatch(setHover(letter))
  },
  incrementRenderCount (mode) {
    dispatch(incrementRenderCount('scatterplot', mode))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(
  toJS(DemoScatterPlot)
)
