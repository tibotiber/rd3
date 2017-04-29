import React from 'react'
import {Provider} from 'react-redux'
import styled from 'styled-components'
import store from '../store'
import Dashboard from './Dashboard'
import Ticker from './Ticker'
import Footer from '../components/styled/Footer'
import '../../node_modules/react-grid-layout/css/styles.css'
import '../../node_modules/react-resizable/css/styles.css'

const Div = styled.div`
  font: 11px sans-serif;
`

const App = () => {
  return (
    <Provider store={store}>
      <Div>
        <Dashboard />
        <Ticker />
        <Footer>
          <a href='https://github.com/tibotiber/rd3' target='_blank'>
            View on GitHub
          </a>
        </Footer>
      </Div>
    </Provider>
  )
}

export default App
