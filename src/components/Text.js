import React, { PropTypes } from 'react'
import styled from 'styled-components'

const { string } = PropTypes

const LeftBorder = styled.p`
  border-left: 5px solid ${props => props.color || 'black'}
  padding-left: 15px
`

const Text = props => {
  return <LeftBorder color={props.color}>{props.text}</LeftBorder>
}

Text.propTypes = {
  text: string,
  color: string
}

export default Text
