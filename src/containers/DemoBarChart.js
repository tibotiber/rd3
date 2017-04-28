import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {createSelector} from 'reselect'
import _ from 'lodash'
import BarChart from '../components/charts/BarChart'
import {ALPHABET, countLettersOccurrences} from '../utils/stringStats'
import {setHover, incrementRenderCount} from '../actions'
import toJS from '../toJS'

const {arrayOf, array, shape, string, func, number} = PropTypes

const DemoBarChart = props => {
  return (
    <BarChart
      data={props.data}
      xDomain={ALPHABET}
      xLabel='Characters'
      yLabel='Occurrences'
      width={props.width}
      height={props.height}
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
  hover: arrayOf(string),
  setHover: func,
  incrementRenderCount: func,
  height: number,
  width: number
}

const getText = state => state.get('text')

const selectData = createSelector(getText, text => {
  return text.reduce((result, userText, user) => {
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
  }, [])
})

const mapStateToProps = (state, ownProps) => {
  return {
    data: selectData(state),
    hover: state.get('hover')
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setHover: letter => dispatch(setHover(letter)),
    incrementRenderCount: mode =>
      dispatch(incrementRenderCount('barchart', mode))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(toJS(DemoBarChart))
