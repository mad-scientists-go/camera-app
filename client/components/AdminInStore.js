import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

export class AdminInStore extends Component {
  static propTypes = {
    prop: PropTypes
  }


  componentWillReceiveProps(newProps) {
    let formattedUsers = this.props.users.map(user => {
        
    })
  }

  render() {
    console.log('they took er jerbs')
    return (
      <div>
        <h1>Admin View For In Store Users</h1>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  users: state.users,
  orders: state.orders
})



const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminInStore)
