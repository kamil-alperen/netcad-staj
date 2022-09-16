import {createStore, applyMiddleware} from "redux";
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

const initialState = {
    productList : [],
    features : [],
    longLat : []
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "UPDATE":
            return {
                ...state,
                productList : action.payload
            }; // update state
        case "FEATURE":
            return {
                ...state,
                features : action.payload
            }
        case "LONGLAT":
            return {
                ...state,
                longLat : action.payload
            }
        default :
            return state; // update state
    }
}

const composedEnhancer = composeWithDevTools(applyMiddleware(thunkMiddleware))
const store = createStore(reducer, composedEnhancer);

export default store;