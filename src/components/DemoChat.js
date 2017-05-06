import React, {PropTypes} from 'react'
import styled from 'styled-components'
import ChatInput from './styled/ChatInput'
import Pallet from './Pallet'

const {arrayOf, shape, string, func, number} = PropTypes

const InlineDiv = styled.div`
  display: inline-block;
`

const DemoChat = React.createClass({
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
  getInitialState () {
    return {
      autoRefresh: false,
      refreshPeriod: 2
    }
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
  toggleAutoRefresh () {
    const autoRefresh = !this.state.autoRefresh
    this.setState({autoRefresh})
    if (autoRefresh) {
      this.autoRefreshInterval = setInterval(() => {
        this.props.generateText()
      }, this.state.refreshPeriod * 1000)
    } else {
      clearInterval(this.autoRefreshInterval)
    }
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
                  width={this.props.width / 2 - 40}
                  height={this.props.height - 120}
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
        <div style={{marginTop: 5}}>
          <input
            type='checkbox'
            checked={this.state.autoRefresh}
            onChange={this.toggleAutoRefresh}
          />
          Generate new text every {this.state.refreshPeriod}s
        </div>
      </InlineDiv>
    )
  }
})

export default DemoChat
