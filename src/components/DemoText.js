import React, {PropTypes} from 'react'
import styled from 'styled-components'
import ChatInput from './styled/ChatInput'
import Pallet from './Pallet'

const {arrayOf, shape, string, func, number} = PropTypes

const InlineDiv = styled.div`
  display: inline-block;
`

const DemoText = React.createClass({
  propTypes: {
    users: arrayOf(string),
    texts: arrayOf(string),
    colors: arrayOf(string),
    generateText: func,
    updateText: func,
    pallet: arrayOf(
      shape({
        name: string,
        value: string
      })
    ),
    setUserColor: func,
    width: number,
    height: number,
    incrementRenderCount: func
  },
  componentDidMount () {
    this.props.incrementRenderCount('component')
    this.props.generateText()
  },
  componentDidUpdate (prevProps, prevState) {
    this.props.incrementRenderCount('component')
  },
  handleChange (user, e) {
    this.props.updateText({[user]: e.target.value})
  },
  render () {
    return (
      <InlineDiv style={{textAlign: 'center'}}>
        <div>
          {this.props.users.map((user, index) => {
            return (
              <InlineDiv key={user}>
                <ChatInput
                  value={this.props.texts[index]}
                  color={this.props.colors[index]}
                  width={this.props.width / 2}
                  height={this.props.height / 2}
                  onChange={e => this.handleChange(user, e)}
                />
                <Pallet
                  colors={this.props.pallet}
                  scope={user}
                  pickColor={this.props.setUserColor}
                />
              </InlineDiv>
            )
          })}
        </div>
        <button onClick={this.props.generateText}>Generate new text</button>
      </InlineDiv>
    )
  }
})

export default DemoText
