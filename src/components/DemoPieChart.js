import React, {PropTypes} from 'react'
import PieChart from 'components/charts/PieChart'

const {arrayOf, number, shape, string, func, bool} = PropTypes

const DemoPieChart = ({
  data,
  incrementRenderCount,
  width,
  height,
  filter,
  toggleFilter,
  hover
}) => {
  const filteredData = hover
    ? ` (letter${hover.length > 1 ? 's' : ''}: ${hover.join(', ')})`
    : ''
  return (
    <div style={{display: 'inline-block'}}>
      <div>
        <input type='checkbox' checked={filter} onChange={toggleFilter} />
        Refresh with filtered data?
      </div>
      <PieChart
        data={data}
        width={width}
        height={height}
        thickness={30}
        incrementRenderCount={incrementRenderCount}
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
