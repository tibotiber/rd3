import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {createSelector} from 'reselect'
import PieChart from '../components/PieChart'
import {countLetters} from '../utils/stringStats'
import {incrementRenderCount} from '../actions'
import toJS from '../toJS'

const {arrayOf, number, shape, string, func} = PropTypes

const DemoBarChart = props => {
  return (
    <PieChart
      data={props.data}
      width={props.width}
      height={props.height}
      thickness={30}
      incrementRenderCount={props.incrementRenderCount}
      title='Text volume by user'
    />
  )
}

DemoBarChart.propTypes = {
  data: arrayOf(
    shape({
      name: string,
      value: number
    })
  ),
  incrementRenderCount: func,
  width: number,
  height: number
}

const getText = state => state.get('text')

const selectData = createSelector(getText, text => {
  return text.reduce((result, userText, user) => {
    const nbOfLetters = countLetters(userText)
    if (nbOfLetters > 0) {
      result.push({
        name: user,
        value: nbOfLetters
      })
    }
    return result
  }, [])
})

const mapStateToProps = (state, ownProps) => {
  return {
    data: selectData(state)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    incrementRenderCount: mode =>
      dispatch(incrementRenderCount('piechart', mode))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(toJS(DemoBarChart))
