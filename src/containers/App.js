import React from 'react'
import { Provider } from 'react-redux'
import store from '../store'
import DemoBarChart from './DemoBarChart'

const App = () => {
  return (
    <Provider store={store}>
      <DemoBarChart />
    </Provider>
  )
}

export default App
