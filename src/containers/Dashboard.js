import React from 'react'
import {connect} from 'react-redux'
import styled from 'styled-components'
import DemoBarChart from './DemoBarChart'

const Dashboard = props => {
  return <div className='dashboard'><DemoBarChart /></div>
}

// this should work from styled-components v2 onwards
// remove the duplicate handling of hover prop on BarChart then
const StyledDashboard = styled(Dashboard)`
  > .data-${props => props.hover} {
    fill: grey;
  }
`

const mapStateToProps = (state, ownProps) => {
  return {
    hover: state.hover
  }
}

export default connect(mapStateToProps)(StyledDashboard)
