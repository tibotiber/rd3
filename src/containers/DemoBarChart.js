import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {createSelector} from 'reselect'
import _ from 'lodash'
import BarChart from '../components/BarChart'
import {ALPHABET, countLettersOccurrences} from '../utils/stringStats'
import {setHover, incrementRenderCount} from '../actions'

const {arrayOf, array, shape, string, func} = PropTypes

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
      incrementRenderCount={props.incrementRenderCount}
    />
  )
}

DemoBarChart.propTypes = {
  data: arrayOf(
    shape({
      name: string,
      values: array
    })
  ),
  hover: string,
  setHover: func,
  incrementRenderCount: func
}

const getText = state => state.text

const selectData = createSelector(getText, text => {
  return _.reduce(
    text,
    (result, userText, user) => {
      result.push({
        name: user,
        values: _.reduce(
          countLettersOccurrences(userText),
          (r, occurrences, letter) => {
            r.push({
              x: letter,
              y: occurrences
            })
            return r
          },
          []
        )
      })
      return result
    },
    []
  )
})

const mapStateToProps = (state, ownProps) => {
  return {
    data: selectData(state),
    hover: state.hover
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setHover: letter => dispatch(setHover(letter)),
    incrementRenderCount: mode =>
      dispatch(incrementRenderCount('barchart', mode))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DemoBarChart)
