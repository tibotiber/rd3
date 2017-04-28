import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import styled from 'styled-components'
import _ from 'lodash'
import toJS from '../toJS'

const {number, object, string, shape} = PropTypes

const CodeBlock = styled.pre`
  position: absolute;
  top: 0;
  right: 0;
  padding: 15px;
  margin: 5px;
  border: dashed 2px grey;
  color: grey;
  background-color: rgba(255, 255, 255, 0.75);
`

const RenderCount = props => {
  return (
    <div>
      {props.component}
      :
      {' '}
      {props.counts.component}
      {props.counts.d3 ? ' / ' + props.counts.d3 : ''}
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

const Ticker = props => {
  return (
    <CodeBlock>
      <div>tick: {props.tick}</div>
      {_.values(
        _.mapValues(props.renderCount, (counts, component) => {
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

const mapStateToProps = (state, ownProps) => {
  return {
    tick: state.get('tick'),
    renderCount: state.get('renderCount')
  }
}

export default connect(mapStateToProps)(toJS(Ticker))
