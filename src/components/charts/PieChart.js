import React, {PropTypes} from 'react'
import Faux from 'react-faux-dom'
import * as d3 from 'd3'
import styled from 'styled-components'
import _ from 'lodash'
import {shallowEqual} from 'recompose'

const {arrayOf, string, number, shape, func} = PropTypes
const LOADING = 'loading...'

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
  .tooltip {
    width: ${props => props.width / 5}px;
    left: ${props => props.width * 2 / 5}px;
    top: ${props => props.height * 2 / 5}px;
  }
`

const PieChart = React.createClass({
  mixins: [Faux.mixins.core, Faux.mixins.anim],
  propTypes: {
    data: arrayOf(
      shape({
        name: string,
        value: number
      })
    ),
    width: number,
    height: number,
    thickness: number,
    incrementRenderCount: func,
    title: string
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
    if (!shallowEqual(this.props, prevProps)) {
      this.renderD3(false)
    }
  },
  setTooltip (user) {
    this.setState({
      tooltip: user
    })
  },
  computeTooltipContent () {
    const hoveredData = _.find(this.props.data, {
      name: this.state.tooltip
    }).value
    return `${this.state.tooltip}: ${hoveredData}`
  },
  render () {
    return (
      <Wrapper
        className='piechart'
        width={this.props.width}
        height={this.props.height}
      >
        {this.state.chart}
        {this.state.tooltip &&
          <div className='tooltip'>
            {this.computeTooltipContent()}
          </div>}
      </Wrapper>
    )
  },
  renderD3 (firstRender) {
    this.props.incrementRenderCount('d3')
    const width = this.props.width
    const height = this.props.height
    const outerRadius = height / 2 - 10
    const innerRadius = outerRadius - this.props.thickness
    let data = _.cloneDeep(this.props.data) // pie() mutates data
    var arc = d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius)
    var pie = d3.layout
      .pie()
      .value(d => d.value)
      .sort(null)
      .startAngle(-120 * Math.PI / 180)
      .endAngle(120 * Math.PI / 180)
      .padAngle(0.01)

    // arc transitions, see https://bl.ocks.org/mbostock/1346410
    // do not use arrow function here as scope is the path element
    function arcTween (a) {
      const i = d3.interpolate(this._current, a)
      this._current = i(0)
      return t => arc(i(t))
    }

    // create a faux div and store its virtual DOM in state.chart
    let faux = this.connectFauxDOM('div', 'chart')

    let svg = firstRender
      ? d3
          .select(faux)
          .append('svg')
          .attr('width', width)
          .attr('height', height)
          .append('g')
          .attr('transform', `translate(${width / 2}, ${height / 2})`)
      : d3.select(faux).select('svg').select('g')

    if (firstRender) {
      svg
        .append('text')
        .attr('class', 'label')
        .attr('y', height * 3 / 10)
        .style('text-anchor', 'middle')
        .text(this.props.title)
    }

    let arcs = svg.selectAll('path').data(pie(data))
    arcs
      .enter()
      .append('path')
      .attr('class', (d, i) => `data-group data-group-${data[i].name}`)
      .attr('d', arc)
      .each(function (d) {
        // store the initial angles for transitions
        // do not use arrow function here as scope is the path element
        this._current = d
      })
      .on('mouseover', (d, i) => {
        clearTimeout(this.unsetTooltipTimeout)
        this.setTooltip(data[i].name)
      })
      .on('mouseout', (d, i) => {
        this.unsetTooltipTimeout = setTimeout(() => this.setTooltip(null), 200)
      })
    arcs.transition().attrTween('d', arcTween)
    this.animateFauxDOM(800)
  }
})

export default PieChart
