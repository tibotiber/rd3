import {connect} from 'react-redux'
import {createSelector} from 'reselect'
import _ from 'lodash'
import DemoBarChart from 'components/DemoBarChart'
import {countLettersOccurrences} from 'utils/stringStats'
import {setHover, incrementRenderCount} from 'redux/actions'
import toJS from 'hocs/toJS'
import {getText, getHover} from 'redux/selectors'

const getData = createSelector(getText, text => {
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
  data: getData(state),
  hover: getHover(state)
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
