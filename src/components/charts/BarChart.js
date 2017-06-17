import React from 'react'
import PropTypes from 'prop-types'
import {withFauxDOM} from 'react-faux-dom'
import styled from 'styled-components'
import _ from 'lodash'
import Tooltip from 'components/Tooltip'
import withD3Renderer from 'hocs/withD3Renderer'
const d3 = {
  ...require('d3-shape'),
  ...require('d3-array'),
  ...require('d3-scale'),
  ...require('d3-axis'),
  ...require('d3-selection'),
  ...require('d3-transition')
}

const {arrayOf, string, number, func, object} = PropTypes
const LOADING = 'loading...'

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
  .tooltip {
    visibility: ${({hover}) => (hover ? 'visible' : 'hidden')};
    -webkit-transition: top .2s ease-out, left .2s ease-out;
  }
`

class BarChart extends React.Component {
  static propTypes = {
    data: arrayOf(object),
    xLabel: string,
    yLabel: string,
    width: number,
    height: number,
    hover: arrayOf(string),
    setHover: func
  }

  state = {
    look: 'stacked'
  }

  computeTooltipProps = letter => {
    const hoveredData = _.omit(_.find(this.props.data, {x: letter}), 'x')
    const computeTop = this.state.look === 'stacked'
      ? arr => this.y(_.sum(arr))
      : arr => this.y(_.max(arr))
    return {
      style: {
        top: computeTop(_.values(hoveredData)) + 5,
        left: this.x(letter) + 40
      },
      content: `${letter}: ${_.values(hoveredData).join(', ')}`
    }
  }

  render() {
    const {hover, chart} = this.props
    return (
      <Wrapper className="barchart" hover={hover}>
        <button onClick={this.toggle}>Toggle</button>
        {chart}
        {chart !== LOADING &&
          hover &&
          hover.map((letter, index) => (
            <Tooltip key={index} {...this.computeTooltipProps(letter)} />
          ))}
      </Wrapper>
    )
  }

  toggle = () => {
    if (this.state.look === 'stacked') {
      this.setState(state => ({look: 'grouped'}))
      this.transitionGrouped()
    } else {
      this.setState(state => ({look: 'stacked'}))
      this.transitionStacked()
    }
  }

  renderD3 = mode => {
    const {
      width,
      height,
      xLabel,
      yLabel,
      setHover,
      connectFauxDOM,
      animateFauxDOM
    } = this.props

    // rendering mode
    const render = mode === 'render'
    const resize = mode === 'resize'

    // d3 helpers
    let data = _.cloneDeep(this.props.data) // stack() mutates data
    const groups = _.without(_.keys(data[0]), 'x')
    const n = groups.length // number of layers
    const layers = d3.stack().keys(groups)(data)
    const yStackMax = d3.max(layers, layer => d3.max(layer, d => d[1]))
    const margin = {top: 20, right: 10, bottom: 50, left: 50}
    const graphWidth = width - margin.left - margin.right
    const graphHeight = height - margin.top - margin.bottom - 18
    const x = d3
      .scaleBand()
      .domain(data.map(d => d.x))
      .rangeRound([0, graphWidth])
      .paddingInner(0.08)
    this.x = x
    const y = d3.scaleLinear().domain([0, yStackMax]).range([graphHeight, 0])
    this.y = y
    const xAxis = d3.axisBottom().scale(x)
    const yAxis = d3.axisLeft().scale(y)

    // create a faux div and store its virtual DOM in state.chart
    let faux = connectFauxDOM('div', 'chart')

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
    layer = layer
      .enter()
      .append('g')
      .attr('class', d => `layer data-group data-group-${d.key}`)
      .merge(layer)

    let rect = layer.selectAll('rect').data(d => d)
    rect = rect
      .enter()
      .append('rect')
      .attr('class', d => `data data-${d.data.x}`)
      .attr('x', d => x(d.data.x))
      .attr('y', graphHeight)
      .attr('width', x.bandwidth())
      .attr('height', 0)
      .on('mouseover', d => {
        clearTimeout(this.unsetHoverTimeout)
        setHover(d.data.x)
      })
      .on('mouseout', d => {
        this.unsetHoverTimeout = setTimeout(() => setHover(null), 200)
      })
      .merge(rect)

    if (this.state.look === 'stacked') {
      rect
        .transition()
        .delay((d, i) => (resize ? 0 : i * 10))
        .attr('x', d => x(d.data.x))
        .attr('y', d => y(d[1]))
        .attr('width', x.bandwidth())
        .attr('height', d => y(d[0]) - y(d[1]))
    } else {
      rect
        .transition()
        .delay((d, i) => (resize ? 0 : i * 10))
        .attr('x', function(d, i) {
          let layerIndex = this.parentNode.__data__.index
          return x(d.data.x) + x.bandwidth() / n * layerIndex
        })
        .attr('y', d => y(d[1] - d[0]))
        .attr('width', x.bandwidth() / n)
        .attr('height', d => graphHeight - y(d[1] - d[0]))
    }
    animateFauxDOM(800)

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
        .attr('x', function(d, i) {
          let layerIndex = this.parentNode.__data__.index
          return x(d.data.x) + x.bandwidth() / n * layerIndex
        })
        .attr('width', x.bandwidth() / n)
        .transition()
        .attr('y', d => y(d[1] - d[0]))
        .attr('height', d => graphHeight - y(d[1] - d[0]))
      animateFauxDOM(2000)
    }

    this.transitionStacked = () => {
      rect
        .transition()
        .duration(500)
        // .delay((d, i) => i * 10)
        .attr('y', d => y(d[1]))
        .attr('height', d => y(d[0]) - y(d[1]))
        .transition()
        .attr('x', d => x(d.data.x))
        .attr('width', x.bandwidth())
      animateFauxDOM(2000)
    }
  }
}

BarChart.defaultProps = {
  chart: LOADING
}

export default withFauxDOM(
  withD3Renderer({updateOn: ['data', 'xLabel', 'yLabel']})(BarChart)
)
