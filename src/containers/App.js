import React from 'react'
import {Provider} from 'react-redux'
import store from '../store'
import ThemedApp from './ThemedApp'
import Dashboard from './Dashboard'
import Ticker from './Ticker'
import Footer from '../components/styled/Footer'

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
