import React, {PropTypes} from 'react'
import styled from 'styled-components'

const {object} = PropTypes

const Div = styled.div`
  text-align: center;
  a {
    color: grey;
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
`

const Text = props => {
  return (
    <Div>
      {props.children}
    </Div>
  )
}

Text.propTypes = {
  children: object
}

export default Text
