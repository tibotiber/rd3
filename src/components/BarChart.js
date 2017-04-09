import React, { PropTypes } from 'react'
import Faux from 'react-faux-dom'
import * as d3 from 'd3'
import styled from 'styled-components'

const { arrayOf, array, string, number } = PropTypes

const BarChart = React.createClass({
  mixins: [Faux.mixins.core, Faux.mixins.anim],
  propTypes: {
    data: arrayOf(array),
    xDomain: array,
    colors: arrayOf(string),
    className: string,
    xLabel: string,
    yLabel: string,
    width: number,
    height: number
  },
  getInitialState () {
    return { look: 'stacked' }
  },
  render () {
    return (
      <div>
        <button onClick={this.toggle}>Toggle</button>
        {this.state.chart}
      </div>
    )
  },
  toggle () {
    if (this.state.look === 'stacked') {
      this.setState({ look: 'grouped' })
      this.transitionGrouped()
    } else {
      this.setState({ look: 'stacked' })
      this.transitionStacked()
    }
  },
  componentDidMount () {
    // create a faux div and store its virtual DOM in state.chart
    var faux = this.connectFauxDOM('div', 'chart')
    var n = this.props.data.length // number of layers
    var stack = d3.layout.stack()
    var layers = stack(this.props.data)
    var yGroupMax = d3.max(layers, layer => {
      return d3.max(layer, d => d.y)
    })
    var yStackMax = d3.max(layers, layer => {
      return d3.max(layer, d => d.y0 + d.y)
    })
    var margin = { top: 40, right: 10, bottom: 50, left: 50 }
    var width = this.props.width - margin.left - margin.right
    var height = this.props.height - margin.top - margin.bottom
    var x = d3.scale.ordinal().domain(this.props.xDomain).rangeRoundBands([0, width], 0.08)
    var y = d3.scale.linear().domain([0, yStackMax]).range([height, 0])
    var color = d3.scale.linear().domain([0, n - 1]).range(this.props.colors)
    var xAxis = d3.svg.axis().scale(x).orient('bottom')
    var yAxis = d3.svg.axis().scale(y).orient('left')

    var svg = d3
      .select(faux)
      .append('svg')
      .attr('class', this.props.className)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)

    var layer = svg
      .selectAll('.layer')
      .data(layers)
      .enter()
      .append('g')
      .attr('class', 'layer')
      .style('fill', (d, i) => color(i))

    var rect = layer
      .selectAll('rect')
      .data(d => d)
      .enter()
      .append('rect')
      .attr('x', d => x(d.x))
      .attr('y', height)
      .attr('width', x.rangeBand())
      .attr('height', 0)

    rect
      .transition()
      .delay((d, i) => i * 10)
      .attr('y', d => y(d.y0 + d.y))
      .attr('height', d => y(d.y0) - y(d.y0 + d.y))

    this.animateFauxDOM(800)

    svg.append('g').attr('class', 'x axis').attr('transform', `translate(0, ${height})`).call(xAxis)
    svg
      .append('text')
      .attr('transform', `translate(${width / 2} ,${height + margin.bottom - 5})`)
      .style('text-anchor', 'middle')
      .text(this.props.xLabel)

    svg.append('g').attr('class', 'y axis').attr('transform', 'translate(0, 0)').call(yAxis)
    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - height / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text(this.props.yLabel)

    this.transitionGrouped = () => {
      y.domain([0, yGroupMax])
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
      y.domain([0, yStackMax])
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
`

export default StyledBarChart
