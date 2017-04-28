import React, {PropTypes} from 'react'
import styled from 'styled-components'

const {arrayOf, shape, string, func} = PropTypes

const List = styled.ul`
  list-style-type: none;
  text-align: right;
  vertical-align: center;
  margin-top: -10px;
  margin-right: 10px;
`

const ColorSquare = styled.li`
  display: inline-block;
  border: solid 1px grey;
  width: 10px;
  height: 10px;
  margin-left: 5px;
  cursor: pointer;
`

const PalletLabel = styled.li`
  display: inline-block;
  position: relative;
  top: -2px;
  margin-right: 5px;
`

const Pallet = props => {
  return (
    <List>
      <PalletLabel>{props.scope}</PalletLabel>
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
  colors: arrayOf(
    shape({
      name: string,
      value: string
    })
  ),
  scope: string,
  pickColor: func
}

export default Pallet
