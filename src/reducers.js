import { NB_OF_LAYERS, NB_OF_SAMPLES_PER_LAYER } from './constants'
import bumpLayer from './bumpLayer'

const defaultState = {
  data: Array(NB_OF_LAYERS).fill(0).map(() => bumpLayer(NB_OF_SAMPLES_PER_LAYER, 0.1))
}

function rootReducer (state = defaultState, action) {
  switch (action.type) {
    default:
      return state
  }
}

export default rootReducer
