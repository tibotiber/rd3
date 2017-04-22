import React, {PropTypes} from 'react'
import Faux from 'react-faux-dom'
import * as d3 from 'd3'
import styled from 'styled-components'
import _ from 'lodash'
import {shallowEqual} from 'recompose'

const {arrayOf, array, string, number, func, shape} = PropTypes
const LOADING = 'loading...'

const BarChart = React.createClass({
  mixins: [Faux.mixins.core, Faux.mixins.anim],
  propTypes: {
    data: arrayOf(
      shape({
        name: string,
        values: array
      })
    ),
    xDomain: array,
    className: string,
    xLabel: string,
    yLabel: string,
    width: number,
    height: number,
    hover: string,
    setHover: func,
    incrementRenderCount: func
  },
  getInitialState () {
    return {
      look: 'stacked',
      chart: LOADING
    }
  },
  componentDidMount () {
    this.props.incrementRenderCount('component')
    this.renderD3(true)
  },
  componentDidUpdate (prevProps, prevState) {
    this.props.incrementRenderCount('component')
    const stripProps = p => _.omit(p, ['hover', 'className'])
    if (!shallowEqual(stripProps(this.props), stripProps(prevProps))) {
      this.renderD3(false)
    }
  },
  render () {
    let tooltip = <div className='tooltip' />
    if (this.state.chart !== LOADING && this.props.hover) {
      const hoveredData = _.map(this.props.data, 'values').map(l =>
        _.find(l, {x: this.props.hover})
      )
      const computeTop = this.state.look === 'stacked'
        ? arr => this.y(_.sum(arr))
        : arr => this.y(_.max(arr))
      const tooltipStyle = {
        top: computeTop(_.map(hoveredData, 'y')) + 5,
        left: this.x(this.props.hover) + 40
      }
      tooltip = (
        <div className='tooltip' style={tooltipStyle}>
          {this.props.hover}: {_.map(hoveredData, 'y').join(', ')}
        </div>
      )
    }

    return (
      <div className={`barchart ${this.props.className}`}>
        <button onClick={this.toggle}>Toggle</button>
        {this.state.chart}
        {tooltip}
      </div>
    )
  },
  toggle () {
    if (this.state.look === 'stacked') {
      this.setState({look: 'grouped'})
      this.transitionGrouped()
    } else {
      this.setState({look: 'stacked'})
      this.transitionStacked()
    }
  },
  renderD3 (firstRender) {
    this.props.incrementRenderCount('d3')
    let data = _.cloneDeep(this.props.data) // stack() mutates data
    const n = this.props.data.length // number of layers
    const stack = d3.layout.stack().values(d => d.values)
    const layers = stack(data)
    const yStackMax = d3.max(layers, layer =>
      d3.max(layer.values, d => d.y0 + d.y)
    )
    const margin = {top: 20, right: 10, bottom: 50, left: 50}
    const width = this.props.width - margin.left - margin.right
    const height = this.props.height - margin.top - margin.bottom
    const x = d3.scale
      .ordinal()
      .domain(this.props.xDomain)
      .rangeRoundBands([0, width], 0.08)
    this.x = x
    const y = d3.scale.linear().domain([0, yStackMax]).range([height, 0])
    this.y = y
    const xAxis = d3.svg.axis().scale(x).orient('bottom')
    const yAxis = d3.svg.axis().scale(y).orient('left')

    // create a faux div and store its virtual DOM in state.chart
    let faux = this.connectFauxDOM('div', 'chart')

    let svg = firstRender
      ? d3
          .select(faux)
          .append('svg')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', `translate(${margin.left}, ${margin.top})`)
      : d3.select(faux).select('svg').select('g')

    let layer = svg.selectAll('.layer').data(layers)
    layer
      .enter()
      .append('g')
      .attr('class', d => `layer data-group data-group-${d.name}`)

    let rect = layer.selectAll('rect').data(d => d.values)
    rect
      .enter()
      .append('rect')
      .attr('class', d => `data data-${d.x}`)
      .attr('x', d => x(d.x))
      .attr('y', height)
      .attr('width', x.rangeBand())
      .attr('height', 0)
      .on('mouseover', d => {
        clearTimeout(this.unsetHoverTimeout)
        this.props.setHover(d.x)
      })
      .on('mouseout', d => {
        this.unsetHoverTimeout = setTimeout(
          () => this.props.setHover(null),
          200
        )
      })
    if (this.state.look === 'stacked') {
      rect
        .transition()
        .delay((d, i) => i * 10)
        .attr('y', d => y(d.y0 + d.y))
        .attr('height', d => y(d.y0) - y(d.y0 + d.y))
    } else {
      rect
        .transition()
        .delay((d, i) => i * 10)
        .attr('y', d => y(d.y))
        .attr('height', d => height - y(d.y))
    }
    this.animateFauxDOM(800)

    if (firstRender) {
      svg
        .append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0, ${height})`)
        .call(xAxis)
      svg
        .append('text')
        .attr(
          'transform',
          `translate(${width / 2} ,${height + margin.bottom - 5})`
        )
        .style('text-anchor', 'middle')
        .text(this.props.xLabel)

      svg
        .append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(0, 0)')
        .call(yAxis)
      svg
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left)
        .attr('x', 0 - height / 2)
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .text(this.props.yLabel)
    } else {
      svg.select('g.x.axis').call(xAxis)
      svg.select('g.y.axis').call(yAxis)
    }

    this.transitionGrouped = () => {
      rect
        .transition()
        .duration(500)
        // .delay((d, i) => i * 10)
        .attr('x', (d, i, j) => x(d.x) + x.rangeBand() / n * j)
        .attr('width', x.rangeBand() / n)
        .transition()
        .attr('y', d => y(d.y))
        .attr('height', d => height - y(d.y))
      this.animateFauxDOM(2000)
    }

    this.transitionStacked = () => {
      rect
        .transition()
        .duration(500)
        // .delay((d, i) => i * 10)
        .attr('y', d => y(d.y0 + d.y))
        .attr('height', d => y(d.y0) - y(d.y0 + d.y))
        .transition()
        .attr('x', d => x(d.x))
        .attr('width', x.rangeBand())
      this.animateFauxDOM(2000)
    }
  }
})

const StyledBarChart = styled(BarChart)`
  .x.axis line,
  .x.axis path,
  .y.axis line,
  .y.axis path {
    fill: none;
    stroke: #000;
  }
  position: relative;
  display: inline-block;
  .tooltip {
    visibility: ${props => (props.hover ? 'visible' : 'hidden')};
    -webkit-transition: top .2s ease-out, left .2s ease-out;
  }
`

export default StyledBarChart
