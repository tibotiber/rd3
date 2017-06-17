import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const {arrayOf, shape, string, func} = PropTypes

const List = styled.ul`
  list-style-type: none;
  text-align: right;
  vertical-align: center;
  margin-top: -8px;
  margin-right: 10px;
`

const ColorSquare = styled.li`
  display: inline-block;
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

class Pallet extends React.Component {
  handleColorPicked = (scope, color) => e => {
    this.props.pickColor(scope, color)
  }

  render() {
    const {colors, scope} = this.props
    return (
      <List>
        <PalletLabel>{scope}</PalletLabel>
        {colors.map(color => (
          <ColorSquare
            key={color.name}
            style={{backgroundColor: color.value}}
            onClick={this.handleColorPicked(scope, color.name)}
          />
        ))}
      </List>
    )
  }
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
