import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import Text from '../components/Text'
import { getColorWithDefaultSaturation } from '../utils/colors'

const { arrayOf, string } = PropTypes

const DemoText = props => {
  return (
    <div>
      {props.users.map((user, index) => {
        return <Text key={user} text={props.texts[index]} color={props.colors[index]} />
      })}
    </div>
  )
}

DemoText.propTypes = {
  users: arrayOf(string),
  texts: arrayOf(string),
  colors: arrayOf(string)
}

const mapStateToProps = (state, ownProps) => {
  return {
    users: Object.keys(state.text).sort(),
    texts: Object.keys(state.text).sort().map(user => state.text[user]),
    colors: Object.keys(state.colors).sort().map(user => {
      return getColorWithDefaultSaturation(state.colors[user])
    })
  }
}

export default connect(mapStateToProps)(DemoText)
