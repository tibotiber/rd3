import {connect} from 'react-redux'
import {createSelector} from 'reselect'
import _ from 'lodash'
import DemoBarChart from '../components/DemoBarChart'
import {countLettersOccurrences} from '../utils/stringStats'
import {setHover, incrementRenderCount} from '../actions'
import toJS from '../toJS'

const getText = state => state.get('text')

const selectData = createSelector(getText, text => {
  return text.reduce((result, userText, user) => {
    result.push({
      name: user,
      values: _.reduce(
        countLettersOccurrences(userText),
        (r, occurrences, letter) => {
          r.push({
            x: letter,
            y: occurrences
          })
          return r
        },
        []
      )
    })
    return result
  }, [])
})

const mapStateToProps = (state, ownProps) => ({
  data: selectData(state),
  hover: state.get('hover')
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  setHover (letter) {
    dispatch(setHover(letter))
  },
  incrementRenderCount (mode) {
    dispatch(incrementRenderCount('barchart', mode))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(toJS(DemoBarChart))
