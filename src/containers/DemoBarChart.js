import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import * as d3Chroma from 'd3-scale-chromatic'
import _ from 'lodash'
import BarChart from '../components/BarChart'
import { ALPHABET, countLettersOccurrences } from '../utils/stringStats'
import { DEFAULT_SATURATION } from '../constants'

const { arrayOf, array, string } = PropTypes

const DemoBarChart = props => {
  return <BarChart data={props.data} xDomain={ALPHABET} colors={props.colors} />
}

DemoBarChart.propTypes = {
  data: arrayOf(array),
  colors: arrayOf(string)
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
      return d3Chroma[`interpolate${_.capitalize(state.colors[user])}s`](DEFAULT_SATURATION)
    })
  }
}

export default connect(mapStateToProps)(DemoBarChart)
