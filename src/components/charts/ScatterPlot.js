import React from 'react'
import PropTypes from 'prop-types'
import {withFauxDOM} from 'react-faux-dom'
import styled from 'styled-components'
import _ from 'lodash'
import Tooltip from 'components/Tooltip'
import withD3Renderer from 'hocs/withD3Renderer'
const d3 = {
  ...require('d3-scale'),
  ...require('d3-axis'),
  ...require('d3-selection'),
  ...require('d3-transition')
}

const {arrayOf, string, number, shape, func, array} = PropTypes
const LOADING = 'loading...'

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
`

class ScatterPlot extends React.Component {
  static propTypes = {
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
    title: string,
    groups: arrayOf(string),
    radiusFactor: number,
    setHover: func
  }

  state = {
    tooltip: null
  }

  setTooltip = (group, x, y) => {
    this.setState(state => ({
      tooltip: group ? {group, x, y} : null
    }))
  }

  computeTooltipProps = () => {
    const {group, x, y} = this.state.tooltip
    const hoveredData = _.find(this.props.data, {group, x, y})
    if (hoveredData) {
      return {
        content: `"${x}${y}": ${hoveredData.n} in ${hoveredData.group}`,
        style: {top: this.y(y) - 18, left: this.x(x) - 8}
      }
    } else {
      return {
        style: {visibility: 'hidden'}
      }
    }
  }

  render() {
    return (
      <Wrapper className="scatterplot">
        {this.props.chart}
        {this.state.tooltip && <Tooltip {...this.computeTooltipProps()} />}
      </Wrapper>
    )
  }

  renderD3 = mode => {
    const {
      width,
      height,
      xDomain,
      yDomain,
      groups,
      setHover,
      radiusFactor,
      title,
      connectFauxDOM,
      animateFauxDOM
    } = this.props

    // rendering mode
    const render = mode === 'render'
    const resize = mode === 'resize'

    // d3 helpers
    const data = _.orderBy(_.cloneDeep(this.props.data), 'n', 'desc') // d3 mutates data
    const margin = {top: 20, right: 20, bottom: 50, left: 30}
    const graphWidth = width - margin.left - margin.right
    const graphHeight = height - margin.top - margin.bottom
    const x = d3.scalePoint().domain(xDomain).rangeRound([0, graphWidth])
    this.x = x
    const dx = d3.scalePoint().domain(groups).rangeRound([-2, 2])
    const y = d3.scalePoint().domain(yDomain).rangeRound([graphHeight, 0])
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

    let dots = svg.selectAll('.dot').data(data, d => d.group + d.x + d.y)
    dots = dots
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
        this.setTooltip(d.group, d.x, d.y)
      })
      .on('mouseout', d => {
        this.unsetHoverTimeout = setTimeout(() => {
          setHover(null)
          this.setTooltip(null)
        }, 200)
      })
      .merge(dots)

    dots
      .transition()
      .attr('r', d => d.n * radiusFactor)
      .attr('cx', d => x(d.x) + dx(d.group))
      .attr('cy', d => y(d.y))

    dots.exit().transition().attr('r', 0).remove()

    animateFauxDOM(800)

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
}

ScatterPlot.defaultProps = {
  chart: LOADING
}

export default withFauxDOM(
  withD3Renderer({
    updateOn: ['data', 'xDomain', 'yDomain', 'title', 'radiusFactor']
  })(ScatterPlot)
)
