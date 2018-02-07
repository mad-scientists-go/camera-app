import React, {Component } from "react";
import {connect} from 'react-redux';
import { me, login } from '../store'
import AdminHome from './AdminHome'
import AdminLogin from './AdminLogin'
import {Route, Switch, Router} from 'react-router-dom'
import history from '../history';
import AdminInStore from './AdminInStore';
import AdminSeeUsers from './AdminSeeUsers';
import AdminOrders from './AdminOrders'


class Admin extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoggedIn: false
        }
    }

    // componentWillReceiveProps(newProps) {
    //     if(newProps.admin.id) {
    //         this.setState({
    //             isLoggedIn: true
    //         })
    //     }
    // }
    componentDidMount() {
        console.log('mounte...')
        this.props.getMe()
    }

    handleLogin() {

    }

    render() {
        return (
            <div>
                <h1>Admin</h1>
                {
                    Object.keys(this.props.adminUser).length > 0 ? 
                    <AdminHome>
                    <div>
                        <Route path="/admin/adminorders" component={AdminOrders} />
                        <Route path="/admin/adminusers" component={AdminSeeUsers} />
                        <Route path="/admin/admininstore" component={AdminInStore} />
                    </div>
                </AdminHome>
                    : <AdminLogin /> 
                }
            </div>
        )
    }
}

const mapState = (state) => {
    return {
        adminUser: state.adminUser
    }
}
const mapDispatch = (dispatch) => {
    return {
        getMe() {
            dispatch(me())
        },
        loginAdminPerson(admin) {
            dispatch(login(admin))
        }
    }
}
export default connect(mapState, mapDispatch)(Admin)