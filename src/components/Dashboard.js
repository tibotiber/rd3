import React, {PropTypes} from 'react'
import styled from 'styled-components'
import {transparentize} from 'polished'
import _ from 'lodash'
import ReactGridLayout, {WidthProvider} from 'react-grid-layout'
import DemoBarChart from '../containers/DemoBarChart'
import DemoPieChart from '../containers/DemoPieChart'
import DemoScatterPlot from '../containers/DemoScatterPlot'
import DemoChat from '../containers/DemoChat'
import WithMeasure from '../hocs/WithMeasure'
import '../../node_modules/react-grid-layout/css/styles.css'
import '../../node_modules/react-resizable/css/styles.css'

const {string, object, func, arrayOf} = PropTypes
const GridLayout = WidthProvider(ReactGridLayout)
const MeasuredDemoBarChart = WithMeasure(DemoBarChart)
const MeasuredDemoScatterPlot = WithMeasure(DemoScatterPlot)
const MeasuredDemoPieChart = WithMeasure(DemoPieChart)
const MeasuredDemoChat = WithMeasure(DemoChat)

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

const generateHoverCss = letter =>
  `
  .data-${letter} {
    opacity: 1;
    -webkit-transition: opacity .2s ease-in;
  }
`

const Grid = styled(GridLayout)`
  .axis text {
    fill: ${props => props.theme.color};
  }
  .axis path,
  .axis line {
    fill: none;
    stroke: ${props => props.theme.color};
    shape-rendering: crispEdges;
  }
  .stroked {
    stroke: ${props => props.theme.color};
  }
  .stroked-negative {
    stroke: ${props => props.theme.background};
  }
  ${props => generateDataGroupCSS(props)}
  .data {
    opacity: ${props => (props.hover ? 0.25 : 1)};
    -webkit-transition: opacity .2s ease-in;
  }
  ${props => props.hover && props.hover.map(letter => generateHoverCss(letter))}
  .tooltip {
    position: absolute;
    z-index: 10;
    display: inline-block;
    border: solid 1px ${props => props.theme.secondaryColor};
    border-radius: 2px;
    padding: 5px;
    background-color: ${props => transparentize(0.2, props.theme.secondaryBackground)};
    text-align: center;
    color: ${props => props.theme.secondaryColor};
  }
`

const Dashboard = React.createClass({
  propTypes: {
    colors: object,
    hover: arrayOf(string),
    incrementRenderCount: func
  },
  componentDidMount () {
    this.props.incrementRenderCount('component')
    window.addEventListener('resize', this.onWindowResize)
  },
  componentDidUpdate (prevProps, prevState) {
    this.props.incrementRenderCount('component')
  },
  componentWillUnmount () {
    window.removeEventListener('resize', this.onWindowResize)
  },
  onWindowResize (e) {
    this.forceUpdate()
  },
  render () {
    const layout = [
      {i: 'TL', x: 0, y: 0, w: 6, h: 7},
      {i: 'TR', x: 6, y: 0, w: 6, h: 7},
      {i: 'BL', x: 0, y: 7, w: 4, h: 5},
      {i: 'BR', x: 4, y: 7, w: 8, h: 5}
    ]
    return (
      <Grid
        className='dashboard'
        hover={this.props.hover}
        colors={this.props.colors}
        layout={layout}
        cols={12}
        rowHeight={(window.innerHeight - 29) / 12}
        margin={[0, 0]}
      >
        <div key={'TL'}>
          <MeasuredDemoBarChart />
        </div>
        <div key={'TR'}>
          <MeasuredDemoScatterPlot />
        </div>
        <div key={'BL'}>
          <MeasuredDemoPieChart />
        </div>
        <div key={'BR'}>
          <MeasuredDemoChat />
        </div>
      </Grid>
    )
  }
})

export default Dashboard
