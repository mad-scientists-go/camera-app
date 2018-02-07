import axios from 'axios';
import history from '../history';

const UPDATE_SHELF = 'UPDATE_SHELF'

export const updateShelf = (quantity) => ({
    type: UPDATE_SHELF,
    quantity
})

let defaultShelfQuantity = 5;  // arr of order obj

export default function(state = defaultShelfQuantity, action){
    switch (action.type){
        case UPDATE_SHELF:
            return state - action.quantity
        default:
            return state
    }
}
