import React, {PropTypes} from 'react'
import styled from 'styled-components'
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
    border: solid 1px grey;
    border-radius: 2px;
    padding: 5px;
    color: grey;
    background-color: rgba(255, 255, 255, 0.75);
    text-align: center;
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
      {i: 'TL', x: 0, y: 0, w: 6, h: 6},
      {i: 'TR', x: 6, y: 0, w: 6, h: 6},
      {i: 'BL', x: 0, y: 6, w: 4, h: 6},
      {i: 'BR', x: 4, y: 6, w: 8, h: 6}
    ]
    return (
      <Grid
        className='dashboard'
        hover={this.props.hover}
        colors={this.props.colors}
        layout={layout}
        cols={12}
        rowHeight={(window.innerHeight - 30) / 12}
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
