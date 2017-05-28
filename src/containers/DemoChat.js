import {connect} from 'react-redux'
import {createSelector} from 'reselect'
import lorem from 'lorem-ipsum'
import DemoChat from 'components/DemoChat'
import {getColorWithDefaultSaturation, COLOR_PALLET} from 'utils/colors'
import {newText, setColor, incrementRenderCount} from 'redux/actions'
import toJS from 'hocs/toJS'
import {getUsers, getTexts, getSaturatedColorsArray} from 'redux/selectors'

const loremOption = {
  count: 2,
  units: 'sentences'
}

const getPallet = createSelector(
  () => COLOR_PALLET,
  pallet => {
    return pallet.map(color => {
      return {
        name: color,
        value: getColorWithDefaultSaturation(color)
      }
    })
  }
)

const mapStateToProps = (state, ownProps) => ({
  users: getUsers(state),
  texts: getTexts(state),
  colors: getSaturatedColorsArray(state),
  pallet: getPallet(state)
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  generateText () {
    dispatch(
      newText({
        user1: lorem(loremOption),
        user2: lorem(loremOption)
      })
    )
  },
  updateText (text) {
    dispatch(newText(text))
  },
  setUserColor (user, color) {
    dispatch(setColor(user, color))
  },
  incrementRenderCount (mode) {
    dispatch(incrementRenderCount('chat', mode))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(toJS(DemoChat))
