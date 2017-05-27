import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {createSelector} from 'reselect'
import styled, {ThemeProvider, injectGlobal} from 'styled-components'
import ThemePicker from 'containers/ThemePicker'
import themes from 'utils/themes'

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

const getTheme = state => state.get('theme')

const selectTheme = createSelector(getTheme, theme => {
  return themes[theme]
})

const mapStateToProps = (state, ownProps) => ({
  theme: selectTheme(state)
})

export default connect(mapStateToProps)(ThemedApp)
