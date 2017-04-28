import React, {PropTypes} from 'react'
import PieChart from './charts/PieChart'

const {arrayOf, number, shape, string, func} = PropTypes

const DemoPieChart = props => {
  return (
    <PieChart
      data={props.data}
      width={props.width}
      height={props.height}
      thickness={30}
      incrementRenderCount={props.incrementRenderCount}
      title='Text volume by user'
    />
  )
}

DemoPieChart.propTypes = {
  data: arrayOf(
    shape({
      name: string,
      value: number
    })
  ),
  incrementRenderCount: func,
  width: number,
  height: number
}

export default DemoPieChart
