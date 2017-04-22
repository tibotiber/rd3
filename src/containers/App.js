import React from 'react'
import {Provider} from 'react-redux'
import store from '../store'
import Dashboard from './Dashboard'
import Ticker from './Ticker'

const App = () => {
  return (
    <Provider store={store}>
      <div>
        <Dashboard />
        <Ticker />
      </div>
    </Provider>
  )
}

export default App
