import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import BarChart from '../components/BarChart'

const { array } = PropTypes

const DemoBarChart = props => {
  return <BarChart data={props.data} />
}

DemoBarChart.propTypes = {
  data: array
}

const mapStateToProps = (state, ownProps) => {
  return {
    data: state.data
  }
}

export default connect(mapStateToProps)(DemoBarChart)
