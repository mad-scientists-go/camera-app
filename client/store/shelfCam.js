import axios from 'axios';
import history from '../history';

const GRAB_PRODUCT = 'GRAB_PRODUCT'
const PUT_BACK_PRODUCT = 'PUT_BACK_PRODUCT';

const grabProduct = (orderId, productId, quantity) => ({
    type: GRAB_PRODUCT,
    orderId, productId, quantity
})
const putBackProduct = (orderId, productId, quantity) => ({
    type: PUT_BACK_PRODUCT,
    orderId, productId, quantity
})


export const addLineItem = (orderId, productId, quantity) =>
    dispatch => {
        axios
          .post('/lineItems', { orderId, productId, quantity })
          .then(res => res.data)
          .catch(dispatchOrHistoryErr =>
            console.error(dispatchOrHistoryErr)
          );
    }

export const removeLineItem = (orderId, productId, quantity) =>
    dispatch => {
        axios
          .delete('/lineItems', { orderId, productId, quantity })
          .then(res => res.data)
          .catch(dispatchOrHistoryErr =>
            console.error(dispatchOrHistoryErr)
          );
    }


defaultOrders = [];  // arr of order obj

export default function(state = defaultOrders, action){
    switch (action.type){
        case GRAB_PRODUCT:
            return [...state.filter(order => order.id !== action.order.id), action.order]
        
        case PUT_BACK_PRODUCT:
            return [...state.filter(order => order.id !== action.order.id), action.order];
    }
}