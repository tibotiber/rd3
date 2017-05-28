import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import styled, {ThemeProvider, injectGlobal} from 'styled-components'
import ThemePicker from 'containers/ThemePicker'
import {getTheme} from 'redux/selectors'

const {object, array} = PropTypes

injectGlobal`
  body {
    margin: 0;
    overflow: hidden;
  }
`

const Root = styled.div`
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.color};
  font: 11px sans-serif;
  padding: 8px;
`

const ThemedApp = props => (
  <ThemeProvider theme={props.theme}>
    <Root>
      {props.children}
      <ThemePicker />
    </Root>
  </ThemeProvider>
)

ThemedApp.propTypes = {
  theme: object,
  children: array
}

const mapStateToProps = (state, ownProps) => ({
  theme: getTheme(state)
})

export default connect(mapStateToProps)(ThemedApp)
