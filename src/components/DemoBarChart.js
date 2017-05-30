import React from 'react'
import {arrayOf, string, func, number, object} from 'prop-types'
import BarChart from 'components/charts/BarChart'

const DemoBarChart = ({
  data,
  width,
  height,
  hover,
  setHover,
  incrementRenderCount
}) => (
  <div style={{width: '100%', height: '100%'}}>
    <BarChart
      data={data}
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
  data: arrayOf(object),
  hover: arrayOf(string),
  setHover: func,
  incrementRenderCount: func,
  height: number,
  width: number
}

export default DemoBarChart
