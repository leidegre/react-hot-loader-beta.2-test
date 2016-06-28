
import { AppContainer } from 'react-hot-loader'
import React from 'react'
import { render } from 'react-dom'

import Root from './root'
import configureStore from './configureStore'

const store = configureStore()

const rootEl = document.getElementById('root')

// Main
render(
  <AppContainer>
    <Root store={store} />
  </AppContainer>,
  rootEl
)

// HMR
if (module.hot) {
  module.hot.accept('./root', () => {
    const HotRoot = require('./root').default
    render(
      <AppContainer>
        <HotRoot store={store} />
      </AppContainer>,
      rootEl
    )
  })
}