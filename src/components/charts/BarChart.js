import React, {PropTypes} from 'react'
import Faux from 'react-faux-dom'
import * as d3 from 'd3'
import styled from 'styled-components'
import _ from 'lodash'
import {shallowEqual} from 'recompose'

const {arrayOf, array, string, number, func, shape, object} = PropTypes
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
  .tooltip {
    visibility: ${({hover}) => (hover ? 'visible' : 'hidden')};
    -webkit-transition: top .2s ease-out, left .2s ease-out;
  }
`

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
    xLabel: string,
    yLabel: string,
    width: number,
    height: number,
    hover: arrayOf(string),
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
    this.renderD3('render')
  },
  componentDidUpdate (prevProps, prevState) {
    this.props.incrementRenderCount('component')
    const dimensions = p => _.pick(p, ['width', 'height'])
    if (!shallowEqual(dimensions(this.props), dimensions(prevProps))) {
      return this.renderD3('resize')
    }
    const stripProps = p => _.omit(p, ['hover'])
    if (!shallowEqual(stripProps(this.props), stripProps(prevProps))) {
      this.renderD3('update')
    }
  },
  computeTooltipProps (letter) {
    const hoveredData = _.map(this.props.data, 'values').map(l =>
      _.find(l, {x: letter})
    )
    const computeTop = this.state.look === 'stacked'
      ? arr => this.y(_.sum(arr))
      : arr => this.y(_.max(arr))
    return {
      style: {
        top: computeTop(_.map(hoveredData, 'y')) + 5,
        left: this.x(letter) + 40
      },
      content: `${letter}: ${_.map(hoveredData, 'y').join(', ')}`
    }
  },
  render () {
    const {hover} = this.props
    const {chart} = this.state
    return (
      <Wrapper className='barchart' hover={hover}>
        <button onClick={this.toggle}>Toggle</button>
        {chart}
        {chart !== LOADING &&
          hover &&
          hover.map((letter, index) => (
            <Tooltip key={index} {...this.computeTooltipProps(letter)} />
          ))}
      </Wrapper>
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
  renderD3 (mode) {
    const {
      incrementRenderCount,
      width,
      height,
      xDomain,
      xLabel,
      yLabel,
      setHover
    } = this.props
    incrementRenderCount('d3')

    // rendering mode
    const render = mode === 'render'
    const resize = mode === 'resize'

    // d3 helpers
    let data = _.cloneDeep(this.props.data) // stack() mutates data
    const n = data.length // number of layers
    const stack = d3.layout.stack().values(d => d.values)
    const layers = stack(data)
    const yStackMax = d3.max(layers, layer =>
      d3.max(layer.values, d => d.y0 + d.y)
    )
    const margin = {top: 20, right: 10, bottom: 50, left: 50}
    const graphWidth = width - margin.left - margin.right
    const graphHeight = height - margin.top - margin.bottom - 18
    const x = d3.scale
      .ordinal()
      .domain(xDomain)
      .rangeRoundBands([0, graphWidth], 0.08)
    this.x = x
    const y = d3.scale.linear().domain([0, yStackMax]).range([graphHeight, 0])
    this.y = y
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
      .attr('y', graphHeight)
      .attr('width', x.rangeBand())
      .attr('height', 0)
      .on('mouseover', d => {
        clearTimeout(this.unsetHoverTimeout)
        setHover(d.x)
      })
      .on('mouseout', d => {
        this.unsetHoverTimeout = setTimeout(() => setHover(null), 200)
      })
    if (this.state.look === 'stacked') {
      rect
        .transition()
        .delay((d, i) => (resize ? 0 : i * 10))
        .attr('x', d => x(d.x))
        .attr('y', d => y(d.y0 + d.y))
        .attr('width', x.rangeBand())
        .attr('height', d => y(d.y0) - y(d.y0 + d.y))
    } else {
      rect
        .transition()
        .delay((d, i) => (resize ? 0 : i * 10))
        .attr('x', (d, i, j) => x(d.x) + x.rangeBand() / n * j)
        .attr('y', d => y(d.y))
        .attr('width', x.rangeBand() / n)
        .attr('height', d => graphHeight - y(d.y))
    }
    this.animateFauxDOM(800)

    if (render) {
      svg
        .append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0, ${graphHeight})`)
        .call(xAxis)
        .append('text')
        .attr('class', 'label')
        .attr('x', graphWidth)
        .attr('y', 35)
        .style('text-anchor', 'end')
        .text(xLabel)

      svg
        .append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(0, 0)')
        .call(yAxis)
        .append('text')
        .attr('class', 'label')
        .attr('transform', 'rotate(-90)')
        .attr('y', -30)
        .style('text-anchor', 'end')
        .text(yLabel)
    } else if (resize) {
      svg
        .select('g.x.axis')
        .attr('transform', `translate(0, ${graphHeight})`)
        .call(xAxis)
        .select('text')
        .attr('x', graphWidth)
      svg.select('g.y.axis').call(yAxis)
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
        .attr('height', d => graphHeight - y(d.y))
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

export default BarChart
