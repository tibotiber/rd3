import React from 'react'
import {arrayOf, shape, string, func, number} from 'prop-types'
import ScatterPlot from 'components/charts/ScatterPlot'
import {ALPHABET} from 'utils/stringStats'

const DemoScatterPlot = ({
  data,
  setHover,
  incrementRenderCount,
  height,
  width,
  groups
}) => (
  <div style={{width: '100%', height: '100%'}}>
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
  </div>
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
