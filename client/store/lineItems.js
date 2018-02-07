import axios from 'axios';
import history from '../history';

const UPDATE_PRODUCT = 'UPDATE_PRODUCT'
//const PUT_BACK_PRODUCT = 'PUT_BACK_PRODUCT';

const updateProduct = (orderId, productId, quantity) => ({
    type: UPDATE_PRODUCT,
    orderId, productId, quantity
})
// const putBackProduct = (orderId, productId, quantity) => ({
//     type: PUT_BACK_PRODUCT,
//     orderId, productId, quantity
// })


export const updateLineItem = (subject_id, qty, productId) =>
    dispatch => {
        axios
          .post('https://smart-mart-server.herokuapp.com/api/lineItems', { subject_id, qty, productId })
          .then(res => console.log('LINE_ITEM', res.data))
          .catch(dispatchOrHistoryErr =>
            console.error(dispatchOrHistoryErr)
          );
    }

// export const removeLineItem = (orderId, productId, quantity) =>
//     dispatch => {
//         axios
//           .delete('/lineItems', { orderId, productId, quantity })
//           .then(res => res.data)
//           .catch(dispatchOrHistoryErr =>
//             console.error(dispatchOrHistoryErr)
//           );
//     }


let defaultOrders = [];  // arr of order obj

export default function(state = defaultOrders, action){
    switch (action.type){
        case UPDATE_PRODUCT:
            return [...state.filter(order => order.id !== action.order.id), action.order]
        default:
            return state
        // case PUT_BACK_PRODUCT:
        //     return [...state.filter(order => order.id !== action.order.id), action.order];
    }
}
