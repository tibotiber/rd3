import styled from 'styled-components'

const Footer = styled.div`
  text-align: center;
  a {
    text-decoration: none;
    color: ${({theme}) => theme.secondaryColor}
  }
  a:hover {
    text-decoration: underline;
  }
`

export default Footer
