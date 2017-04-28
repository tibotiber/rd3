import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {createSelector} from 'reselect'
import lorem from 'lorem-ipsum'
import styled from 'styled-components'
import Text from '../components/Text'
import Pallet from '../components/Pallet'
import {getColorWithDefaultSaturation} from '../utils/colors'
import {newText, setColor, incrementRenderCount} from '../actions'
import {COLOR_PALLET} from '../constants'
import toJS from '../toJS'

const {arrayOf, shape, string, func, number} = PropTypes

const InlineDiv = styled.div`
  display: inline-block;
`

const DemoText = React.createClass({
  propTypes: {
    users: arrayOf(string),
    texts: arrayOf(string),
    colors: arrayOf(string),
    generateText: func,
    updateText: func,
    pallet: arrayOf(
      shape({
        name: string,
        value: string
      })
    ),
    setUserColor: func,
    width: number,
    height: number,
    incrementRenderCount: func
  },
  componentDidMount () {
    this.props.incrementRenderCount('component')
    this.props.generateText()
  },
  componentDidUpdate (prevProps, prevState) {
    this.props.incrementRenderCount('component')
  },
  handleChange (user, e) {
    this.props.updateText({[user]: e.target.value})
  },
  render () {
    return (
      <InlineDiv style={{textAlign: 'center'}}>
        <div>
          {this.props.users.map((user, index) => {
            return (
              <InlineDiv key={user}>
                <Text
                  value={this.props.texts[index]}
                  color={this.props.colors[index]}
                  width={this.props.width / 2}
                  height={this.props.height / 2}
                  onChange={e => this.handleChange(user, e)}
                />
                <Pallet
                  colors={this.props.pallet}
                  scope={user}
                  pickColor={this.props.setUserColor}
                />
              </InlineDiv>
            )
          })}
        </div>
        <button onClick={this.props.generateText}>Generate new text</button>
      </InlineDiv>
    )
  }
})

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
          user1: lorem(),
          user2: lorem()
        })
      )
    },
    updateText: text => dispatch(newText(text)),
    setUserColor: (user, color) => dispatch(setColor(user, color)),
    incrementRenderCount: mode =>
      dispatch(incrementRenderCount('chat', mode))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(toJS(DemoText))
