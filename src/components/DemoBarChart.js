import React from 'react'
import {arrayOf, array, shape, string, func, number} from 'prop-types'
import BarChart from 'components/charts/BarChart'
import {ALPHABET} from 'utils/stringStats'

const DemoBarChart = ({
  data,
  hover,
  setHover,
  incrementRenderCount,
  height,
  width
}) => (
  <div style={{width: '100%', height: '100%'}}>
    <BarChart
      data={data}
      xDomain={ALPHABET}
      xLabel='Characters'
      yLabel='Occurrences'
      width={width}
      height={height}
      hover={hover}
      setHover={setHover}
      incrementRenderCount={incrementRenderCount}
    />
  </div>
)

DemoBarChart.propTypes = {
  data: arrayOf(
    shape({
      name: string,
      values: array
    })
  ),
  hover: arrayOf(string),
  setHover: func,
  incrementRenderCount: func,
  height: number,
  width: number
}

export default DemoBarChart
