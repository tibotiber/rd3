import React, {PropTypes} from 'react'
import styled from 'styled-components'

const {string, number, func} = PropTypes

const LeftBorder = styled.textarea`
  border: solid 1px #ddd;
  border-left: 5px solid ${props => props.color || 'black'};
  padding-left: 15px;
  margin: 10px;
  padding: 5px;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
`

const Text = props => {
  return (
    <LeftBorder
      color={props.color}
      width={props.width}
      height={props.height}
      value={props.text}
      onChange={e => props.onChange(props.user, e)}
    />
  )
}

Text.propTypes = {
  user: string,
  text: string,
  color: string,
  width: number,
  height: number,
  onChange: func
}

export default Text
