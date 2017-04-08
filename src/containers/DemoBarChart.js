import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import BarChart from '../components/BarChart'
import { ALPHABET, countLettersOccurrences } from '../utils/stringStats'

const { arrayOf, array } = PropTypes

const DemoBarChart = props => {
  return <BarChart data={props.data} xDomain={ALPHABET} />
}

DemoBarChart.propTypes = {
  data: arrayOf(array)
}

const mapStateToProps = (state, ownProps) => {
  return {
    data: Object.keys(state.text).map(user => {
      const occurrences = countLettersOccurrences(state.text[user])
      return Object.keys(occurrences).map((letter, index) => {
        return { x: letter, y: occurrences[letter] }
      })
    })
  }
}

export default connect(mapStateToProps)(DemoBarChart)
