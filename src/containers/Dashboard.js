import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import styled from 'styled-components'
import {createSelector} from 'reselect'
import _ from 'lodash'
import {getColorWithDefaultSaturation} from '../utils/colors'
import DemoBarChart from './DemoBarChart'
import DemoPieChart from './DemoPieChart'
import {incrementRenderCount} from '../actions'

const {string, object, func} = PropTypes

const Dashboard = React.createClass({
  propTypes: {
    className: string, // for styled components
    incrementRenderCount: func
  },
  componentDidMount () {
    this.props.incrementRenderCount('component')
  },
  componentDidUpdate (prevProps, prevState) {
    this.props.incrementRenderCount('component')
  },
  render () {
    return (
      <div className={`dashboard ${this.props.className}`}>
        <DemoBarChart />
        <DemoPieChart />
      </div>
    )
  }
})

const generateDataGroupCSS = props => {
  return _.reduce(
    props.colors,
    (result, color, user) => {
      result += `.data-group-${user} { fill: ${color}; }`
      return result
    },
    ''
  )
}

const StyledDashboard = styled(Dashboard)`
  ${props => generateDataGroupCSS(props)}
  .data {
    opacity: ${props => (props.hover ? 0.3 : 1)};
    -webkit-transition: opacity .2s ease-in;
  }
  .data-${props => props.hover} {
    opacity: 1;
    -webkit-transition: opacity .2s ease-in;
  }
  .tooltip {
    position: absolute;
    z-index: 10;
    display: inline-block;
    border: solid 1px grey;
    border-radius: 2px;
    padding: 5px;
    color: grey;
    background-color: rgba(255, 255, 255, 0.75);
    text-align: center;
  }
`

StyledDashboard.propTypes = {
  colors: object,
  hover: string
}

const getColors = state => state.colors

const selectColors = createSelector(getColors, colors => {
  return _.mapValues(colors, color => getColorWithDefaultSaturation(color))
})

const mapStateToProps = (state, ownProps) => {
  return {
    hover: state.hover,
    colors: selectColors(state)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    incrementRenderCount: mode =>
      dispatch(incrementRenderCount('dashboard', mode))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StyledDashboard)
