import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import styled from 'styled-components'

const {number} = PropTypes

const Div = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: 15px;
`

const Ticker = props => {
  return <Div>tick: {props.tick}</Div>
}

Ticker.propTypes = {
  tick: number
}

const mapStateToProps = (state, ownProps) => {
  return {
    tick: state.tick
  }
}

export default connect(mapStateToProps)(Ticker)
