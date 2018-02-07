import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {auth} from '../store'
import CamSignup from './CamSignUp'
import MotionLogin from './MotionLogin'
import ShelfCamera from './ShelfCamera'

/**
 * COMPONENT
 */
const AuthForm = (props) => {
  const {name, displayName} = props
  let view = props.name === 'login' ? <MotionLogin /> : <CamSignup />
  return (
    <div>
      {
        view
      }
      <a href="/auth/google">{displayName} with Google</a>
    </div>
  )
}

const mapLogin = (state) => {
  return {
    name: 'login',
    displayName: 'Login'
  }
}

const mapSignup = (state) => {
  return {
    name: 'signup',
    displayName: 'Sign Up'
  }
}

export const Login = connect(mapLogin)(AuthForm)
export const Signup = connect(mapSignup)(AuthForm)

/**
 * PROP TYPES
 */
AuthForm.propTypes = {
  name: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
}
