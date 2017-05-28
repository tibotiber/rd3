import React from 'react'
import {connect} from 'react-redux'
import {createSelector} from 'reselect'
import DemoPieChart from 'components/DemoPieChart'
import {countLetters} from 'utils/stringStats'
import {incrementRenderCount} from 'redux/actions'
import toJS from 'hocs/toJS'
import {getText, getHover} from 'redux/selectors'

const getFilterEnabled = (state, ownProps) => ownProps.filter

const getAutoHover = createSelector(
  [getHover, getFilterEnabled],
  (hover, filter) => {
    return filter ? hover : null
  }
)

const getData = createSelector([getText, getAutoHover], (text, hover) => {
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
  data: getData(state, ownProps),
  hover: getAutoHover(state, ownProps)
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
