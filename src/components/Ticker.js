import React, {PropTypes} from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import {transparentize} from 'polished'

const {number, object, string, shape} = PropTypes

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
      {component}
      :
      {' '}
      {counts.component}
      {counts.d3 ? ' / ' + counts.d3 : ''}
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

const Ticker = ({tick, renderCount}) => {
  return (
    <CodeBlock>
      <div>tick: {tick}</div>
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

Ticker.propTypes = {
  tick: number,
  renderCount: object
}

export default Ticker
