import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import ChatInput from 'components/styled/ChatInput'
import Pallet from 'components/Pallet'

const {arrayOf, shape, string, func, number} = PropTypes

const InlineDiv = styled.div`
  display: inline-block;
`

class DemoChat extends React.Component {
  static propTypes = {
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
  }

  state = {
    autoRefresh: false,
    refreshPeriod: 2
  }

  componentDidMount() {
    this.props.incrementRenderCount('component')
    this.props.generateText()
  }

  componentDidUpdate(prevProps, prevState) {
    this.props.incrementRenderCount('component')
  }

  handleChange = user => e => {
    this.props.updateText({[user]: e.target.value})
  }

  toggleAutoRefresh = () => {
    this.setState(state => {
      const autoRefresh = !state.autoRefresh
      if (autoRefresh) {
        this.autoRefreshInterval = setInterval(() => {
          this.props.generateText()
        }, state.refreshPeriod * 1000)
      } else {
        clearInterval(this.autoRefreshInterval)
      }
      return {autoRefresh}
    })
  }

  render() {
    const {
      users,
      texts,
      colors,
      width,
      height,
      pallet,
      setUserColor,
      generateText
    } = this.props
    const {autoRefresh, refreshPeriod} = this.state
    return (
      <InlineDiv style={{width: '100%', height: '100%', textAlign: 'center'}}>
        <div>
          {users.map((user, index) => {
            return (
              <InlineDiv key={user}>
                <ChatInput
                  value={texts[index]}
                  color={colors[index]}
                  width={width / 2 - 40}
                  height={height - 120}
                  onChange={this.handleChange(user)}
                />
                <Pallet colors={pallet} scope={user} pickColor={setUserColor} />
              </InlineDiv>
            )
          })}
        </div>
        <button onClick={generateText}>Generate new text</button>
        <div style={{marginTop: 5}}>
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={this.toggleAutoRefresh}
          />
          Generate new text every {refreshPeriod}s
        </div>
      </InlineDiv>
    )
  }
}

export default DemoChat
