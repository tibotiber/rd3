import {connect} from 'react-redux'
import {createSelector} from 'reselect'
import lorem from 'lorem-ipsum'
import DemoChat from '../components/DemoChat'
import {getColorWithDefaultSaturation} from '../utils/colors'
import {newText, setColor, incrementRenderCount} from '../actions'
import {COLOR_PALLET} from '../constants'
import toJS from '../toJS'

const loremOption = {
  count: 2,
  units: 'sentences'
}

const getText = state => state.get('text')

const selectUsers = createSelector(getText, text => {
  return text.sortBy((v, k) => k).keySeq()
})

const selectTexts = createSelector(getText, text => {
  return text.sortBy((v, k) => k).valueSeq()
})

const getColors = state => state.get('colors')

const selectColors = createSelector(getColors, colors => {
  return colors.sortBy((v, k) => k).valueSeq().map(color => {
    return getColorWithDefaultSaturation(color)
  })
})

const getPallet = state => COLOR_PALLET

const selectPallet = createSelector(getPallet, pallet => {
  return pallet.map(color => {
    return {
      name: color,
      value: getColorWithDefaultSaturation(color)
    }
  })
})

const mapStateToProps = (state, ownProps) => {
  return {
    users: selectUsers(state),
    texts: selectTexts(state),
    colors: selectColors(state),
    pallet: selectPallet(state)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    generateText: () => {
      dispatch(
        newText({
          user1: lorem(loremOption),
          user2: lorem(loremOption)
        })
      )
    },
    updateText: text => dispatch(newText(text)),
    setUserColor: (user, color) => dispatch(setColor(user, color)),
    incrementRenderCount: mode => dispatch(incrementRenderCount('chat', mode))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(toJS(DemoChat))
