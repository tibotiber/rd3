import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import styled from 'styled-components'
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

// this should work from styled-components v2 onwards
// remove the duplicate handling of hover prop on BarChart then
const StyledDashboard = styled(Dashboard)`
  .data {
    opacity: ${props => props.hover ? 0.3 : 1};
    -webkit-transition: opacity .2s ease-in;
  }
  .data-${props => props.hover} {
    opacity: 1;
    -webkit-transition: opacity .2s ease-in;
  }
`

const mapStateToProps = (state, ownProps) => {
  return {
    hover: state.hover
  }
}

export default connect(mapStateToProps)(StyledDashboard)
