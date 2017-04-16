import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import styled from 'styled-components'
import {createSelector} from 'reselect'
import {getColorWithDefaultSaturation} from '../utils/colors'
import DemoBarChart from './DemoBarChart'

const {string} = PropTypes

const Dashboard = props => {
  return (
    <div className={`dashboard ${props.className}`}>
      <DemoBarChart />
    </div>
  )
}

Dashboard.propTypes = {
  className: string // for styled components
}

const StyledDashboard = styled(Dashboard)`
  ${props => props.colors.map((color, index) => {
    return `.data-group-${index} { 
      fill: ${color};
    }`
  })}
  .data {
    opacity: ${props => props.hover ? 0.3 : 1};
    -webkit-transition: opacity .2s ease-in;
  }
  .data-${props => props.hover} {
    opacity: 1;
    -webkit-transition: opacity .2s ease-in;
  }
`

const getColors = state => state.colors

const selectColors = createSelector(getColors, colors => Object.keys(colors).sort().map(user => {
  return getColorWithDefaultSaturation(colors[user])
}))

const mapStateToProps = (state, ownProps) => {
  return {
    hover: state.hover,
    colors: selectColors(state)
  }
}

export default connect(mapStateToProps)(StyledDashboard)
