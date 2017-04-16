import React, {PropTypes} from 'react'
import styled from 'styled-components'

const {arrayOf, shape, string, func, object} = PropTypes

const List = styled.ul`
  list-style-type: none;
  text-align: right;
  margin-top: -10px;
  margin-right: 5px;
`

const ColorSquare = styled.li`
  display: inline-block;
  border: solid 1px grey;
  width: 10px;
  height: 10px;
  margin-right: 5px;
  cursor: pointer;
`

ColorSquare.propTypes = {
  color: shape({
    name: string,
    value: string
  }),
  pickColor: func,
  scope: string
}

const Pallet = props => {
  return (
    <List>
      {props.colors.map(color => (
        <ColorSquare
          key={color.name}
          style={{backgroundColor: color.value}}
          onClick={e => props.pickColor(props.scope, color.name)}
        />
      ))}
    </List>
  )
}

Pallet.propTypes = {
  colors: arrayOf(object)
}

export default Pallet
