import React, {PropTypes} from 'react'
import ScatterPlot from 'components/charts/ScatterPlot'
import {ALPHABET} from 'utils/stringStats'

const {arrayOf, shape, string, func, number} = PropTypes

const DemoScatterPlot = ({
  data,
  setHover,
  incrementRenderCount,
  height,
  width,
  groups
}) => (
  <ScatterPlot
    data={data}
    xDomain={ALPHABET}
    yDomain={ALPHABET}
    groups={groups}
    title='Characters co-occurrence side-by-side'
    width={width}
    height={height}
    setHover={setHover}
    incrementRenderCount={incrementRenderCount}
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
