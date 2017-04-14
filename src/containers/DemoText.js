import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import lorem from 'lorem-ipsum'
import Text from '../components/Text'
import {getColorWithDefaultSaturation} from '../utils/colors'
import {newText} from '../actions'

const {arrayOf, string, func} = PropTypes

const DemoText = React.createClass({
  propTypes: {
    users: arrayOf(string),
    texts: arrayOf(string),
    colors: arrayOf(string),
    generateText: func,
    updateText: func
  },
  componentDidMount () {
    this.props.generateText()
  },
  render () {
    return (
      <div>
        <div>
          {this.props.users.map((user, index) => {
            return (
              <Text
                key={user}
                user={user}
                text={this.props.texts[index]}
                color={this.props.colors[index]}
                width={450}
                height={100}
                onChange={this.handleChange}
              />
            )
          })}
        </div>
        <button onClick={this.props.generateText}>Generate new text</button>
      </div>
    )
  },
  handleChange (user, e) {
    this.props.updateText({[user]: e.target.value})
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
    },
    updateText: text => {
      dispatch(newText(text))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DemoText)
