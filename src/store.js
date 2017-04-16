import {createStore} from 'redux'
import reducers from './reducers'
import {tick} from './actions'

const store = createStore(reducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

// tick whole app every second to test pure rendering of charts
setInterval(() => store.dispatch(tick()), 1000)

export default store
