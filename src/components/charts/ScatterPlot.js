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

const Wrapper = styled.div`
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
    this.renderD3('render')
  },
  componentDidUpdate (prevProps, prevState) {
    this.props.incrementRenderCount('component')
    const dimensions = p => _.pick(p, ['width', 'height'])
    if (!shallowEqual(dimensions(this.props), dimensions(prevProps))) {
      return this.renderD3('resize')
    }
    if (!shallowEqual(this.props, prevProps)) {
      this.renderD3('update')
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
    if (hoveredData) {
      return {
        content: `"${x}${y}": ${hoveredData.n} in ${hoveredData.group}`,
        style: {top: top + 10, left: left + 10, position: 'fixed'}
      }
    } else {
      return {
        style: {visibility: 'hidden'}
      }
    }
  },
  render () {
    return (
      <Wrapper className='scatterplot'>
        {this.state.chart}
        {this.state.tooltip && <Tooltip {...this.computeTooltipProps()} />}
      </Wrapper>
    )
  },
  renderD3 (mode) {
    this.props.incrementRenderCount('d3')

    // rendering mode
    const render = mode === 'render'
    const resize = mode === 'resize'

    // d3 helpers
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

    let svg
    if (render) {
      svg = d3
        .select(faux)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
    } else if (resize) {
      svg = d3
        .select(faux)
        .select('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .select('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
    } else {
      svg = d3.select(faux).select('svg').select('g')
    }

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

    dots
      .transition()
      .attr('r', d => d.n * this.props.radiusFactor)
      .attr('cx', d => x(d.x) + dx(d.group))
      .attr('cy', d => y(d.y))

    dots.exit().transition().attr('r', 0).remove()

    this.animateFauxDOM(800)

    if (render) {
      svg
        .append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0, ${height})`)
        .call(xAxis)
        .append('text')
        .attr('class', 'label')
        .attr('x', width / 2)
        .attr('y', 35)
        .style('text-anchor', 'middle')
        .text(this.props.title)

      svg.append('g').attr('class', 'y axis').call(yAxis)
    } else if (resize) {
      svg
        .select('g.x.axis')
        .attr('transform', `translate(0, ${height})`)
        .call(xAxis)
        .select('text')
        .attr('x', width / 2)
      svg.select('g.y.axis').call(yAxis)
    } else {
      svg.select('g.x.axis').call(xAxis)
      svg.select('g.y.axis').call(yAxis)
    }
  }
})

export default ScatterPlot
