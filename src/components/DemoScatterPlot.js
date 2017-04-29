import React, {PropTypes} from 'react'
import ScatterPlot from './charts/ScatterPlot'
import {ALPHABET} from '../utils/stringStats'

const {arrayOf, shape, string, func, number} = PropTypes

const DemoScatterPlot = props => (
  <ScatterPlot
    data={props.data}
    xDomain={ALPHABET}
    yDomain={ALPHABET}
    groups={props.groups}
    title='Characters co-occurrence side-by-side'
    width={props.width}
    height={props.height}
    setHover={props.setHover}
    incrementRenderCount={props.incrementRenderCount}
    radiusFactor={4}
  />
)

DemoScatterPlot.propTypes = {
  data: arrayOf(
    shape({
      group: string,
      x: string,
      y: string,
      n: number
    })
  ),
  setHover: func,
  incrementRenderCount: func,
  height: number,
  width: number,
  groups: arrayOf(string)
}

export default DemoScatterPlot
