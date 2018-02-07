import axios from 'axios'

//Action Types
const GET_ORDERS = 'GET_ORDERS';
const DELETE_ORDER = 'DELETE_ORDER';
const UPDATE_STATUS = 'UPDATE_STATUS';

//Action Creators

const getOrders = (orders) => ({
    type: GET_ORDERS,
    orders
})
const deleteOrder = (orderId) => ({
    type: DELETE_ORDER,
    orderId
})
const updateOrderStatus = (order) => ({
    type: UPDATE_STATUS,
    order
    
})

//initialState
const allOrders = [];

//thunks/thunk creators
export const fetchOrders = () => dispatch => {
    axios.get('/api/orders')
    .then(res => {
        dispatch(getOrders(res.data))
    })
}

export const removeOrder = (id) => dispatch => {
    axios.delete(`/api/orders/${id}`)
    .then(res => res.data)
    .then(console.log('buhBAH'))
}

export const updateStatus = (id, status) => dispatch => {
    console.log('status for order', status, id)
    axios.put(`/api/orders/${id}`, {status})
    .then(res => {
        console.log(res.data, 'got obj from api')
        dispatch(updateOrderStatus(res.data))
    })
}

export default function(state = allOrders, action) {
    switch (action.type) {
        case GET_ORDERS:
        return action.orders
        case DELETE_ORDER:
        return action.orders.filter(order => order.id !== action.orderId)
        case UPDATE_STATUS:
        console.log(action.order, 'this is the state before the map')
        return [...state.filter(order => order.id !== action.order.id), action.order];
        default: return state
    }
}
