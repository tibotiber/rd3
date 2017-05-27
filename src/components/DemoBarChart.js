import React, {PropTypes} from 'react'
import BarChart from 'components/charts/BarChart'
import {ALPHABET} from 'utils/stringStats'

const {arrayOf, array, shape, string, func, number} = PropTypes

const DemoBarChart = props => (
  <BarChart
    data={props.data}
    xDomain={ALPHABET}
    xLabel='Characters'
    yLabel='Occurrences'
    width={props.width}
    height={props.height}
    hover={props.hover}
    setHover={props.setHover}
    incrementRenderCount={props.incrementRenderCount}
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
