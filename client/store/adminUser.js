import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_ADMIN_USER = 'GET_ADMIN_USER'
const REMOVE_USER = 'REMOVE_USER'

/**
 * INITIAL STATE
 */
const defaultUser = {}

/**
 * ACTION CREATORS
 */
const loginAdminUser = adminUser => ({type: GET_ADMIN_USER, adminUser})
const removeUser = () => ({type: REMOVE_USER})
/**
 * THUNK CREATORS
 */
export const me = () =>
  dispatch =>
    axios.get('/auth/me')
      .then(res =>
        dispatch(loginAdminUser(res.data || defaultUser)))
      .catch(err => console.log(err))

export const auth = (email, password, method) =>
  dispatch =>
    axios.post(`/auth/${method}`, { email, password })
      .then(res => {
        dispatch(loginAdminUser(res.data || defaultUser))
        history.push('/home')
      }, authError => { // rare example: a good use case for parallel (non-catch) error handler
        dispatch(loginAdminUser({error: authError}))
      })
      .catch(dispatchOrHistoryErr => console.error(dispatchOrHistoryErr))


export const signupWithImage = (email, password, subject_id, card_num, first, last) =>
  dispatch =>
    axios.post(`/auth/signup-image`, { email, password, subject_id, card_num, first, last })
    .then(res => {
      // dispatch(getUser(res.data))
      history.push('/home')
    })
    .catch(dispatchOrHistoryErr => console.error(dispatchOrHistoryErr))

export const login = (email, password) => dispatch => {
  console.log('login email', email)
  axios.post('/auth/adminLogin', {email, password})
  .then(res => {
    dispatch(loginAdminUser(res.data || null))
    history.push('/admin');
  })
}

export const logout = (name) =>
  dispatch => {
   return axios.post('/auth/logout')
      .then(_ => {
        dispatch(removeUser())

        history.push('/login')
      })
      .catch(err => console.log(err))
    }
/**
 * REDUCER
 */
export default function (state = defaultUser, action) {
  switch (action.type) {
    case GET_ADMIN_USER:
      return action.adminUser
    case REMOVE_USER:
      return defaultUser
    default:
      return state
  }
}
