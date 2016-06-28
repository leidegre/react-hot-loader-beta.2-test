
import React, { Component } from 'react'

class Welcome extends Component {
  componentWillMount() {
    console.log('Welcome', 'componentWillMount')
  }

  componentWillUnmount() {
    console.log('Welcome', 'componentWillUnmount')
  }

  render() {
    return (
      <h1>Hello World!!!</h1>
    )
  }
}

export default Welcome