import React, {Component} from 'react'
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import AdminInStore from './AdminInStore';
import AdminSeeUsers from './AdminSeeUsers';
import AdminOrders from './AdminOrders';
import {Link} from 'react-router-dom';
export default class AdminNav extends Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false
        }
    }
    handleToggle = () => this.setState({open: !this.state.open});
    handleClose = () => this.setState({open: false});
  render() {
      return (
    <div>
    <RaisedButton
    label="Toggle Drawer"
    onClick={this.handleToggle}
  />
  <Drawer docked={false} onRequestChange={(open) => this.setState({open})} open={this.state.open}>
  <Link to="/admin/adminorders"><MenuItem onClick={this.handleClose}>Order History</MenuItem></Link>
  <Link to="/admin/adminusers"><MenuItem onClick={this.handleClose}>All Users</MenuItem></Link>
  <Link to="/admin/admininstore"><MenuItem onClick={this.handleClose}>Manage Store</MenuItem></Link>
  <MenuItem onClick={this.handleClose}> Menu Item 2</MenuItem>
</Drawer>
    </div>
  )
}
}

