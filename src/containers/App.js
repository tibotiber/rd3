import React from 'react'
import { Provider } from 'react-redux'
import store from '../store'
import DemoBarChart from './DemoBarChart'
import DemoText from './DemoText'

const App = () => {
  return (
    <Provider store={store}>
      <div>
        <DemoBarChart />
        <DemoText />
      </div>
    </Provider>
  )
}

export default App
