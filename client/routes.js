
import { Chrome, Welcome } from './chrome'

// Route configuration
const routes = [
  {
    path: '/',
    component: Chrome,
    indexRoute: { component: Welcome },
    childRoutes: [
      // ...
    ]
  }
]

module.exports = routes
