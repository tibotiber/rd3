import {createStore} from 'redux'
import reducers, {initialState} from './reducers'
import {tick} from './actions'

const store = createStore(
  reducers,
  initialState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

// tick whole app every second to test pure rendering of charts
setInterval(() => store.dispatch(tick()), 1000)

export default store
