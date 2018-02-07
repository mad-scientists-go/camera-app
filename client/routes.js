import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Route, Switch, Router} from 'react-router-dom'
import PropTypes from 'prop-types'
import history from './history'
import {Main, Login, Signup, UserHome } from './components'
import ShelfCamera from './components/ShelfCamera'
import {me} from './store'
import Admin from './components/Admin';
import AdminOrders from './components/AdminOrders';
/**
 * COMPONENT
 */
const Routes = (props) => {
  console.log('this is hit upon opening the app')
  return (
    <Router history={history}>
      <Main>
          <div>
          <Switch>
            {/* Routes placed here are available to all visitors */}

            <Route path ="/shelfcamera" component={ShelfCamera} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            {/* Displays our Login component as a fallback */}
            <Route path="/admin" component={Admin} />
          </Switch>
          </div>
      </Main>
    </Router>
  )
}
export default Routes
