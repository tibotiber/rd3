import React from 'react'
import {Provider} from 'react-redux'
import store from '../store'
import Dashboard from './Dashboard'
import DemoText from './DemoText'
import Ticker from './Ticker'

const App = () => {
  return (
    <Provider store={store}>
      <div>
        <Ticker />
        <Dashboard />
        <DemoText />
      </div>
    </Provider>
  )
}

export default App
