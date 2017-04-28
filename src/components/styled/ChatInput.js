import styled from 'styled-components'

const ChatInput = styled.textarea`
  border: solid 1px #ddd;
  border-left: 5px solid ${props => props.color || 'black'};
  padding-left: 15px;
  margin: 10px;
  padding: 5px;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
`

export default ChatInput
