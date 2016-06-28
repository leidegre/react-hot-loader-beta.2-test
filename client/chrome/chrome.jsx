
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { init } from './actions'

class Chrome extends Component {
  componentWillMount() {
    this.props.init()
  }
  render() {
    const { children } = this.props
    return (
      <div>
        {children}
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    init
  }, dispatch)
}

export default connect(null, mapDispatchToProps)(Chrome)
