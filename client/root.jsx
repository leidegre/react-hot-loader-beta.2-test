
import React from 'react'
import { Provider } from 'react-redux'
import { Router, browserHistory } from 'react-router'

import routes from './routes'

if (process.env.NODE_ENV === 'production') {
  // ...
} else {
  // the hacky workaround
  // see http://stackoverflow.com/a/37533533/58961
  Router.prototype.componentWillReceiveProps = function (nextProps) {
    const components = []
    function grabComponents(routes) {
      routes.forEach((route) => {
        if (route.component) {
          components.push(route.component)
        }
        if (route.indexRoute && route.indexRoute.component) {
          components.push(route.indexRoute.component)
        }
        if (route.childRoutes) {
          grabComponents(route.childRoutes)
        }
      })
    }
    grabComponents(nextProps.routes)
    components.forEach(React.createElement) // force patching
  }
}

export default function Root(props) {
  const { store } = props
  return (
    <Provider store={store}>
      <Router history={browserHistory} routes={routes} />
    </Provider>
  )
}