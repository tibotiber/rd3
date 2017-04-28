import React, {PropTypes} from 'react'
import Faux from 'react-faux-dom'
import * as d3 from 'd3'
import {event as currentEvent} from 'd3'
import styled from 'styled-components'
import _ from 'lodash'
import {shallowEqual} from 'recompose'

const {arrayOf, string, number, shape, func, array, object} = PropTypes
const LOADING = 'loading...'

const Tooltip = props => {
  return (
    <div className='tooltip' style={props.style}>
      {props.content}
    </div>
  )
}

Tooltip.propTypes = {
  content: string,
  style: object
}

const ScatterPlot = React.createClass({
  mixins: [Faux.mixins.core, Faux.mixins.anim],
  propTypes: {
    data: arrayOf(
      shape({
        group: string,
        x: string,
        y: string,
        n: number
      })
    ),
    className: string,
    width: number,
    height: number,
    xDomain: array,
    yDomain: array,
    incrementRenderCount: func,
    title: string,
    groups: arrayOf(string),
    radiusFactor: number,
    setHover: func
  },
  getInitialState () {
    return {
      chart: LOADING,
      tooltip: null
    }
  },
  componentDidMount () {
    this.props.incrementRenderCount('component')
    this.renderD3(true)
  },
  componentDidUpdate (prevProps, prevState) {
    this.props.incrementRenderCount('component')
    const stripProps = p => _.omit(p, ['className'])
    if (!shallowEqual(stripProps(this.props), stripProps(prevProps))) {
      this.renderD3(false)
    }
  },
  setTooltip (group, x, y, top, left) {
    this.setState({
      tooltip: group ? {group, x, y, top, left} : null
    })
  },
  computeTooltipProps () {
    const {group, x, y, top, left} = this.state.tooltip
    const hoveredData = _.find(this.props.data, {group, x, y})
    return {
      content: `"${x}${y}": ${hoveredData.n} in ${hoveredData.group}`,
      style: {top: top + 10, left: left + 10, position: 'fixed'}
    }
  },
  render () {
    return (
      <div className={`scatterplot ${this.props.className}`}>
        {this.state.chart}
        {this.state.tooltip && <Tooltip {...this.computeTooltipProps()} />}
      </div>
    )
  },
  renderD3 (firstRender) {
    this.props.incrementRenderCount('d3')
    const data = _.orderBy(_.cloneDeep(this.props.data), 'n', 'desc') // d3 mutates data
    const margin = {top: 20, right: 20, bottom: 50, left: 30}
    const width = this.props.width - margin.left - margin.right
    const height = this.props.height - margin.top - margin.bottom
    const x = d3.scale
      .ordinal()
      .domain(this.props.xDomain)
      .rangeRoundPoints([0, width])
    const dx = d3.scale
      .ordinal()
      .domain(this.props.groups)
      .rangeRoundPoints([-2, 2])
    const y = d3.scale
      .ordinal()
      .domain(this.props.yDomain)
      .rangeRoundPoints([height, 0])
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

    let dots = svg.selectAll('.dot').data(data, d => d.group + d.x + d.y)

    dots
      .enter()
      .append('circle')
      .attr(
        'class',
        d => `dot data-group data-group-${d.group} data data-${d.x} data-${d.y}`
      )
      .attr('r', 0)
      .attr('cx', d => x(d.x) + dx(d.group))
      .attr('cy', d => y(d.y))
      .on('mouseover', d => {
        clearTimeout(this.unsetHoverTimeout)
        this.props.setHover([d.x, d.y])
        this.setTooltip(
          d.group,
          d.x,
          d.y,
          currentEvent.pageY,
          currentEvent.pageX
        )
      })
      .on('mouseout', d => {
        this.unsetHoverTimeout = setTimeout(() => {
          this.props.setHover(null)
          this.setTooltip(null)
        }, 200)
      })

    dots.transition().attr('r', d => d.n * this.props.radiusFactor)

    dots.exit().transition().attr('r', 0).remove()

    this.animateFauxDOM(800)

    if (firstRender) {
      svg
        .append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)
        .append('text')
        .attr('class', 'label')
        .attr('x', width / 2)
        .attr('y', 35)
        .style('text-anchor', 'middle')
        .text(this.props.title)

      svg.append('g').attr('class', 'y axis').call(yAxis)
    } else {
      svg.select('g.x.axis').call(xAxis)
      svg.select('g.y.axis').call(yAxis)
    }
  }
})

const StyledScatterPlot = styled(ScatterPlot)`
  position: relative;
  display: inline-block;
  .axis path,
  .axis line {
    fill: none;
    stroke: #000;
    shape-rendering: crispEdges;
  }
  .dot {
    stroke: #ffffff;
  }
`

export default StyledScatterPlot
