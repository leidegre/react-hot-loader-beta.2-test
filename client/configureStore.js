
// This module is responsible for setting up the Redux store

import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { browserHistory } from 'react-router'
import { routerMiddleware } from 'react-router-redux'

export default function configureStore(initialState) {
  const createStoreWithOptionalDevToolsExtension =
    compose( // Composes functions from right to left, see http://redux.js.org/docs/api/compose.html
      applyMiddleware(thunk, routerMiddleware(browserHistory)),
      typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : (x) => x
    )(createStore)

  const initialStateShape = require('./reducers')
  const store = createStoreWithOptionalDevToolsExtension(combineReducers(initialStateShape), initialState)

  if (module.hot) { // Adds support for Webpack hot module replacement
    module.hot.accept('./reducers', () => {
      const nextStateShape = require('./reducers')
      store.replaceReducer(combineReducers(nextStateShape))
    })
  }

  return store
}