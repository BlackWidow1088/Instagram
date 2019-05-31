import { combineReducers } from 'redux';
const counter = (state = 0, action) => {
    switch (action.type) {
        case 'INCREMENT':
            state += 1;
            break;
        case 'DECREMENT':
            state -= 1;
            break;
        default:
            break;
    }
    return state;
}

const user = (state = {}, action) => {
    switch (action.type) {
        case 'UPDATE_EMAIL':
            return { ...state, email: action.payload }
        case 'UPDATE_PASSWORD':
            return { ...state, password: action.payload }
        default:
            return state
    }
}

export default combineReducers({
    counter, user
});