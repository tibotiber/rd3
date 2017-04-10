import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { getColorWithDefaultSaturation } from '../utils/colors'
import BarChart from '../components/BarChart'
import { ALPHABET, countLettersOccurrences } from '../utils/stringStats'
import { setHover } from '../actions'

const { arrayOf, array, string, func } = PropTypes

const DemoBarChart = props => {
  return (
    <BarChart
      data={props.data}
      xDomain={ALPHABET}
      xLabel='Characters'
      yLabel='Occurrences'
      colors={props.colors}
      width={960}
      height={500}
      hover={props.hover}
      setHover={props.setHover}
    />
  )
}

DemoBarChart.propTypes = {
  data: arrayOf(array),
  colors: arrayOf(string),
  hover: string,
  setHover: func
}

const mapStateToProps = (state, ownProps) => {
  return {
    data: Object.keys(state.text).sort().map(user => {
      const occurrences = countLettersOccurrences(state.text[user])
      return Object.keys(occurrences).map((letter, index) => {
        return { x: letter, y: occurrences[letter] }
      })
    }),
    colors: Object.keys(state.colors).sort().map(user => {
      return getColorWithDefaultSaturation(state.colors[user])
    }),
    hover: state.hover
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setHover: letter => {
      dispatch(setHover(letter))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DemoBarChart)
