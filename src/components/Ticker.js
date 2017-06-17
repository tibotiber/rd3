import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import _ from 'lodash'
import {transparentize} from 'polished'

const {number, object, string, shape, func} = PropTypes

const CodeBlock = styled.pre`
  position: absolute;
  top: 0;
  right: 0;
  padding: 15px;
  margin: 5px;
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

  componentDidMount() {
    this.tickInterval = setInterval(this.props.tick, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.tickInterval)
  }

  render() {
    const {tickValue, renderCount} = this.props
    return (
      <CodeBlock>
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
    )
  }
}

export default Ticker
