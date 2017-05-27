import React from 'react'
import {connect} from 'react-redux'
import {createSelector} from 'reselect'
import DemoPieChart from 'components/DemoPieChart'
import {countLetters} from 'utils/stringStats'
import {incrementRenderCount} from 'redux/actions'
import toJS from 'hocs/toJS'

const getText = state => state.get('text')
const getHover = state => state.get('hover')
const getFilterEnabled = (state, ownProps) => ownProps.filter

const selectHover = createSelector(
  [getHover, getFilterEnabled],
  (hover, filter) => {
    return filter ? hover : null
  }
)

const selectData = createSelector([getText, selectHover], (text, hover) => {
  return text.reduce((result, userText, user) => {
    const nbOfLetters = countLetters(userText, hover ? hover.toJS() : null)
    result.push({
      name: user,
      value: nbOfLetters
    })
    return result
  }, [])
})

const mapStateToProps = (state, ownProps) => ({
  data: selectData(state, ownProps),
  hover: selectHover(state, ownProps)
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  incrementRenderCount(mode) {
    dispatch(incrementRenderCount('piechart', mode))
  }
})

const ConnectedPie = connect(mapStateToProps, mapDispatchToProps)(
  toJS(DemoPieChart)
)

class AutoFilterPie extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      filterEnabled: true
    }
  }

  toggleFilter = () => {
    this.setState(state => ({
      filterEnabled: !state.filterEnabled
    }))
  }

  render() {
    return (
      <ConnectedPie
        filter={this.state.filterEnabled}
        toggleFilter={this.toggleFilter}
        {...this.props}
      />
    )
  }
}

export default AutoFilterPie
