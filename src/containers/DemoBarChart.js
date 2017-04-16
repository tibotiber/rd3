import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {createSelector} from 'reselect'
import BarChart from '../components/BarChart'
import {ALPHABET, countLettersOccurrences} from '../utils/stringStats'
import {setHover} from '../actions'

const {arrayOf, array, string, func} = PropTypes

const DemoBarChart = props => {
  return (
    <BarChart
      data={props.data}
      xDomain={ALPHABET}
      xLabel='Characters'
      yLabel='Occurrences'
      width={960}
      height={500}
      hover={props.hover}
      setHover={props.setHover}
    />
  )
}

DemoBarChart.propTypes = {
  data: arrayOf(array),
  hover: string,
  setHover: func
}

const getText = state => state.text

const selectData = createSelector(getText, text => Object.keys(text).sort().map(user => {
  const occurrences = countLettersOccurrences(text[user])
  return Object.keys(occurrences).map((letter, index) => {
    return {x: letter, y: occurrences[letter]}
  })
}))

const mapStateToProps = (state, ownProps) => {
  return {
    data: selectData(state),
    hover: state.hover
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setHover: letter => dispatch(setHover(letter))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DemoBarChart)
