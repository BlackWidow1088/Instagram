import { combineReducers } from 'redux';

const user = (state = {}, action) => {
    switch (action.type) {
        case 'UPDATE_EMAIL':
            return { ...state, email: action.payload }
        case 'UPDATE_PASSWORD':
            return { ...state, password: action.payload };
        case 'UPDATE_USERNAME':
            return { ...state, username: action.payload };
        case 'UPDATE_BIO':
            return { ...state, bio: action.payload };
        case 'LOGIN':
            return action.payload
        case 'SIGNOUT':
            return {};
        default:
            return state
    }
}

export default combineReducers({
     user
});