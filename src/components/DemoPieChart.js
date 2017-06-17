import React from 'react'
import PropTypes from 'prop-types'
import PieChart from 'components/charts/PieChart'

const {arrayOf, string, func, bool} = PropTypes

const DemoPieChart = props => {
  const {hover, filter, toggleFilter, ...otherProps} = props
  const filteredData = hover
    ? ` (letter${hover.length > 1 ? 's' : ''}: ${hover.join(', ')})`
    : ''
  return (
    <div style={{width: '100%', height: '100%', display: 'inline-block'}}>
      <div>
        <input type='checkbox' checked={filter} onChange={toggleFilter} />
        Refresh with filtered data?
      </div>
      <PieChart
        thickness={30}
        title={`Text volume by user${filteredData}`}
        {...otherProps}
      />
    </div>
  )
}

DemoPieChart.propTypes = {
  filter: bool,
  toggleFilter: func,
  hover: arrayOf(string)
}

export default DemoPieChart
