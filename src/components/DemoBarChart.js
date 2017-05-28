import React, {PropTypes} from 'react'
import BarChart from 'components/charts/BarChart'
import {ALPHABET} from 'utils/stringStats'

const {arrayOf, array, shape, string, func, number} = PropTypes

const DemoBarChart = ({
  data,
  hover,
  setHover,
  incrementRenderCount,
  height,
  width
}) => (
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
