import React from 'react'
import {arrayOf, string, number, shape, func, array, object} from 'prop-types'
import Faux from 'react-faux-dom'
import * as d3 from 'd3'
import {event as currentEvent} from 'd3'
import styled from 'styled-components'
import _ from 'lodash'
import {shallowEqual} from 'recompose'

const LOADING = 'loading...'

const Tooltip = ({style, content}) => {
  return (
    <div className='tooltip' style={style}>
      {content}
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
    const {chart, tooltip} = this.state
    return (
      <Wrapper className='scatterplot'>
        {chart}
        {tooltip && <Tooltip {...this.computeTooltipProps()} />}
      </Wrapper>
    )
  },
  renderD3 (mode) {
    const {
      incrementRenderCount,
      width,
      height,
      xDomain,
      yDomain,
      groups,
      setHover,
      radiusFactor,
      title
    } = this.props
    incrementRenderCount('d3')

    // rendering mode
    const render = mode === 'render'
    const resize = mode === 'resize'

    // d3 helpers
    const data = _.orderBy(_.cloneDeep(this.props.data), 'n', 'desc') // d3 mutates data
    const margin = {top: 20, right: 20, bottom: 50, left: 30}
    const graphWidth = width - margin.left - margin.right
    const graphHeight = height - margin.top - margin.bottom
    const x = d3.scale
      .ordinal()
      .domain(xDomain)
      .rangeRoundPoints([0, graphWidth])
    const dx = d3.scale.ordinal().domain(groups).rangeRoundPoints([-2, 2])
    const y = d3.scale
      .ordinal()
      .domain(yDomain)
      .rangeRoundPoints([graphHeight, 0])
    const xAxis = d3.svg.axis().scale(x).orient('bottom')
    const yAxis = d3.svg.axis().scale(y).orient('left')

    // create a faux div and store its virtual DOM in state.chart
    let faux = this.connectFauxDOM('div', 'chart')

    let svg
    if (render) {
      svg = d3
        .select(faux)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
    } else if (resize) {
      svg = d3
        .select(faux)
        .select('svg')
        .attr('width', width)
        .attr('height', height)
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
        d =>
          `dot stroked-negative data-group data-group-${d.group} data data-${d.x} data-${d.y}`
      )
      .attr('r', 0)
      .attr('cx', d => x(d.x) + dx(d.group))
      .attr('cy', d => y(d.y))
      .on('mouseover', d => {
        clearTimeout(this.unsetHoverTimeout)
        setHover([d.x, d.y])
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
          setHover(null)
          this.setTooltip(null)
        }, 200)
      })

    dots
      .transition()
      .attr('r', d => d.n * radiusFactor)
      .attr('cx', d => x(d.x) + dx(d.group))
      .attr('cy', d => y(d.y))

    dots.exit().transition().attr('r', 0).remove()

    this.animateFauxDOM(800)

    if (render) {
      svg
        .append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0, ${graphHeight})`)
        .call(xAxis)
        .append('text')
        .attr('class', 'label')
        .attr('x', graphWidth / 2)
        .attr('y', 35)
        .style('text-anchor', 'middle')
        .text(title)

      svg.append('g').attr('class', 'y axis').call(yAxis)
    } else if (resize) {
      svg
        .select('g.x.axis')
        .attr('transform', `translate(0, ${graphHeight})`)
        .call(xAxis)
        .select('text')
        .attr('x', graphWidth / 2)
      svg.select('g.y.axis').call(yAxis)
    } else {
      svg.select('g.x.axis').call(xAxis)
      svg.select('g.y.axis').call(yAxis)
    }
  }
})

export default ScatterPlot
