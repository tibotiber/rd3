import React from 'react'
import {Provider} from 'react-redux'
import configureStore from 'configureStore'
import ThemedApp from 'containers/ThemedApp'
import Dashboard from 'containers/Dashboard'
import Ticker from 'containers/Ticker'
import Footer from 'components/styled/Footer'
import {tick} from 'actions'

const store = configureStore()

// tick whole app every second to test pure rendering of charts
setInterval(() => store.dispatch(tick()), 1000)

const App = () => (
  <Provider store={store}>
    <ThemedApp>
      <Dashboard />
      <Ticker />
      <Footer>
        <a href='https://github.com/tibotiber/rd3' target='_blank'>
          View code on GitHub
        </a>
      </Footer>
    </ThemedApp>
  </Provider>
)

export default App
