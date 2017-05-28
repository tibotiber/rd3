import {connect} from 'react-redux'
import {createSelector} from 'reselect'
import DemoScatterPlot from 'components/DemoScatterPlot'
import {countLettersCoOccurrences} from 'utils/stringStats'
import {setHover, incrementRenderCount} from 'redux/actions'
import toJS from 'hocs/toJS'
import {getText, getUsers} from 'redux/selectors'

const getData = createSelector(getText, text => {
  return text.reduce((result, userText, user) => {
    return result.concat(
      countLettersCoOccurrences(userText).map(o => {
        return {group: user, x: o.letter1, y: o.letter2, n: o.count}
      })
    )
  }, [])
})

const mapStateToProps = (state, ownProps) => ({
  data: getData(state),
  groups: getUsers(state)
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
