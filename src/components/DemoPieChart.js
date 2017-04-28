import React, {PropTypes} from 'react'
import PieChart from './charts/PieChart'

const {arrayOf, number, shape, string, func, bool} = PropTypes

const DemoPieChart = props => {
  const filteredData = props.hover
    ? ` (letter${props.hover.length > 1 ? 's' : ''}: ${props.hover.join(', ')})`
    : ''
  return (
    <div style={{display: 'inline-block'}}>
      <div>
        <input
          type='checkbox'
          checked={props.filter}
          onChange={props.toggleFilter}
        />
        Refresh with filtered data?
      </div>
      <PieChart
        data={props.data}
        width={props.width}
        height={props.height}
        thickness={30}
        incrementRenderCount={props.incrementRenderCount}
        title={`Text volume by user${filteredData}`}
      />
    </div>
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
  height: number,
  filter: bool,
  toggleFilter: func,
  hover: arrayOf(string)
}

export default DemoPieChart
