import {darken, lighten} from 'polished'

const themes = {
  default: {
    background: 'white',
    color: 'black',
    border: 'lightgrey',
    get secondaryBackground () {
      return darken(0.03, this.background)
    },
    get secondaryColor () {
      return lighten(0.55, this.color)
    }
  },
  dark: {
    background: '#222',
    color: 'lightgrey',
    border: '#666',
    get secondaryBackground () {
      return lighten(0.2, this.background)
    },
    get secondaryColor () {
      return darken(0.2, this.color)
    }
  }
}

export default themes
