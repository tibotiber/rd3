import React, { PropTypes } from 'react'
import Faux from 'react-faux-dom'
import * as d3 from 'd3'

const { array } = PropTypes

const BarChart = React.createClass({
  mixins: [Faux.mixins.core, Faux.mixins.anim],
  propTypes: {
    data: array
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
    // This will create a faux div and store its virtual DOM
    // in state.chart
    var faux = this.connectFauxDOM('div', 'chart')
    var component = this

    // see https://bl.ocks.org/mbostock/3943967 + changes:
    // - feeding D3 the faux node created above
    // - calling this.animateFauxDOM(duration) after each animation kickoff
    // - attaching the radio button callbacks to the component
    // - deleting the radio button (as we do the toggling through the react button)

    var n = this.props.data.length // number of layers
    var m = this.props.data[0].length // number of samples per layer
    var stack = d3.layout.stack()
    var layers = stack(this.props.data)
    var yGroupMax = d3.max(layers, layer => {
      return d3.max(layer, d => d.y)
    })
    var yStackMax = d3.max(layers, layer => {
      return d3.max(layer, d => d.y0 + d.y)
    })
    var margin = { top: 40, right: 10, bottom: 20, left: 10 }
    var width = 960 - margin.left - margin.right
    var height = 500 - margin.top - margin.bottom
    var x = d3.scale.ordinal().domain(d3.range(m)).rangeRoundBands([0, width], 0.08)
    var y = d3.scale.linear().domain([0, yStackMax]).range([height, 0])
    var color = d3.scale.linear().domain([0, n - 1]).range(['#aad', '#556'])
    var xAxis = d3.svg.axis().scale(x).tickSize(0).tickPadding(6).orient('bottom')

    var svg = d3
      .select(faux)
      .append('svg')
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

    svg.append('g').attr('class', 'x axis').attr('transform', 'translate(0,' + height + ')').call(xAxis)

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

      component.animateFauxDOM(2000)
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

      component.animateFauxDOM(2000)
    }
  }
})

export default BarChart
