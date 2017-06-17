import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import _ from 'lodash'
import {transparentize} from 'polished'

const {number, object, string, shape, func} = PropTypes

const Toggle = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  margin: 5px;
  cursor: pointer;
`

const CodeBlock = Toggle.withComponent('pre').extend`
  padding: 15px;
  border: dashed 2px ${({theme}) => theme.secondaryColor};
  color: ${({theme}) => theme.secondaryColor};
  background-color: ${({theme}) => transparentize(0.2, theme.secondaryBackground)};
`

const RenderCount = ({component, counts}) => {
  return (
    <div>
      {component}: {counts.component}{counts.d3 ? ' / ' + counts.d3 : ''}
    </div>
  )
}

RenderCount.propTypes = {
  component: string,
  counts: shape({
    component: number,
    d3: number
  })
}

class Ticker extends React.PureComponent {
  static propTypes = {
    tickValue: number,
    renderCount: object,
    tick: func
  }

  state = {
    displayPanel: false
  }

  componentDidMount() {
    this.tickInterval = setInterval(this.props.tick, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.tickInterval)
  }

  toggleDisplay = e => {
    this.setState(state => ({displayPanel: !state.displayPanel}))
  }

  render() {
    const {tickValue, renderCount} = this.props
    return this.state.displayPanel
      ? <CodeBlock onClick={this.toggleDisplay}>
          <div>tick: {tickValue}</div>
          {_.values(
            _.mapValues(renderCount, (counts, component) => {
              return (
                <RenderCount
                  key={component}
                  component={component}
                  counts={counts}
                />
              )
            })
          )}
        </CodeBlock>
      : <Toggle onClick={this.toggleDisplay}>Show Render Counts</Toggle>
  }
}

export default Ticker
