import styled from 'styled-components'

const ChatInput = styled.textarea`
  border: solid 1px ${props => props.theme.border};
  border-left: 5px solid ${props => props.color};
  padding-left: 15px;
  margin: 10px;
  padding: 5px;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.color};
`

export default ChatInput
