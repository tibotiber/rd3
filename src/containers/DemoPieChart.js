import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {createSelector} from 'reselect'
import _ from 'lodash'
import PieChart from '../components/PieChart'
import {countLetters} from '../utils/stringStats'

const {arrayOf, number, shape, string} = PropTypes

const DemoBarChart = props => {
  return <PieChart data={props.data} width={960} height={500} thickness={30} />
}

DemoBarChart.propTypes = {
  data: arrayOf(
    shape({
      name: string,
      value: number
    })
  )
}

const getText = state => state.text

const selectData = createSelector(getText, text => {
  return _.reduce(
    text,
    (result, userText, user) => {
      const nbOfLetters = countLetters(userText)
      if (nbOfLetters > 0) {
        result.push({
          name: user,
          value: nbOfLetters
        })
      }
      return result
    },
    []
  )
})

const mapStateToProps = (state, ownProps) => {
  return {
    data: selectData(state)
  }
}

export default connect(mapStateToProps)(DemoBarChart)
