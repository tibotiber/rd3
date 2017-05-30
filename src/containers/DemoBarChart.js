import {connect} from 'react-redux'
import {createSelector} from 'reselect'
import DemoBarChart from 'components/DemoBarChart'
import {countLetters, ALPHABET} from 'utils/stringStats'
import {setHover, incrementRenderCount} from 'redux/actions'
import toJS from 'hocs/toJS'
import {getText, getHover} from 'redux/selectors'

const getData = createSelector(getText, text => {
  return ALPHABET.map(l => {
    return text.reduce(
      (result, userText, user) => {
        return {
          ...result,
          [user]: countLetters(userText, l)
        }
      },
      {x: l}
    )
  })
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
