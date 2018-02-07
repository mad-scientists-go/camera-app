import React, {Component } from "react";
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';


import AdminNav from './AdminNav';

class AdminHome extends Component {
    constructor(props) {
        super(props)
        this.state = {open: false};
    }
    handleToggle = () => this.setState({open: !this.state.open});
    handleClose = () => this.setState({open: false});
    render() {
        return (
            <div>
            { 
                <div>
                <AdminNav />
                </div>
            }
               

            {this.props.children}
            </div>
           
        )
    }
}
export default connect(null,null)(AdminHome)