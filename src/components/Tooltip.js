import React from 'react'
import PropTypes from 'prop-types'

const {string, object} = PropTypes

const Tooltip = ({style = {}, content}) => (
  <div className='tooltip' style={style}>
    {content}
  </div>
)

Tooltip.propTypes = {
  content: string,
  style: object
}

export default Tooltip
