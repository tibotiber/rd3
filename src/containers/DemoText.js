import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import lorem from 'lorem-ipsum'
import Text from '../components/Text'
import { getColorWithDefaultSaturation } from '../utils/colors'
import { newText } from '../actions'

const { arrayOf, string, func } = PropTypes

const DemoText = React.createClass({
  propTypes: {
    users: arrayOf(string),
    texts: arrayOf(string),
    colors: arrayOf(string),
    generateText: func
  },
  componentDidMount () {
    this.props.generateText()
  },
  render () {
    return (
      <div>
        <div>
          {this.props.users.map((user, index) => {
            return <Text key={user} text={this.props.texts[index]} color={this.props.colors[index]} />
          })}
        </div>
        <button onClick={this.props.generateText}>Generate new text</button>
      </div>
    )
  }
})

const mapStateToProps = (state, ownProps) => {
  return {
    users: Object.keys(state.text).sort(),
    texts: Object.keys(state.text).sort().map(user => state.text[user]),
    colors: Object.keys(state.colors).sort().map(user => {
      return getColorWithDefaultSaturation(state.colors[user])
    })
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
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DemoText)
