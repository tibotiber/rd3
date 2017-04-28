import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {createSelector} from 'reselect'
import ScatterPlot from '../components/ScatterPlot'
import {ALPHABET, countLettersCoOccurrences} from '../utils/stringStats'
import {setHover, incrementRenderCount} from '../actions'
import toJS from '../toJS'

const {arrayOf, shape, string, func, number} = PropTypes

const DemoScatterPlot = props => {
  return (
    <ScatterPlot
      data={props.data}
      xDomain={ALPHABET}
      yDomain={ALPHABET}
      groups={props.groups}
      title='Characters co-occurrence side-by-side'
      width={props.width}
      height={props.height}
      setHover={props.setHover}
      incrementRenderCount={props.incrementRenderCount}
      radiusFactor={4}
    />
  )
}

DemoScatterPlot.propTypes = {
  data: arrayOf(
    shape({
      group: string,
      x: string,
      y: string,
      n: number
    })
  ),
  setHover: func,
  incrementRenderCount: func,
  height: number,
  width: number,
  groups: arrayOf(string)
}

const getText = state => state.get('text')

const selectData = createSelector(getText, text => {
  return text.reduce((result, userText, user) => {
    return result.concat(
      countLettersCoOccurrences(userText).map(o => {
        return {group: user, x: o.letter1, y: o.letter2, n: o.count}
      })
    )
  }, [])
})

const selectGroups = createSelector(getText, text => {
  return text.keySeq()
})

const mapStateToProps = (state, ownProps) => {
  return {
    data: selectData(state),
    groups: selectGroups(state)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setHover: letter => dispatch(setHover(letter)),
    incrementRenderCount: mode =>
      dispatch(incrementRenderCount('scatterplot', mode))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  toJS(DemoScatterPlot)
)
