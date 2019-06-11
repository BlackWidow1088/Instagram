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
        case 'UPDATE_PHOTO':
            return { ...state, photo: action.payload };
        case 'GET_TOKEN':
            return { ...state, token: action.payload }
        case 'SIGNOUT':
            return {};
        default:
            return state
    }
}

const post = (state = {}, action) => {
    switch (action.type) {
        case 'UPDATE_DESCRIPTION':
            return { ...state, description: action.payload };
        case 'GET_POSTS':
            return { ...state, feed: action.payload };
        case 'ADD_POST':
            if (state && state.feed) {
                return { ...state, feed: [...state.feed, action.payload] };
            }
            return { ...state, feed: [action.payload] };
        case 'UPDATE_POST_PHOTO':
            return { ...state, postPhoto: action.payload };
        case 'UPDATE_LOCATION':
            return { ...state, location: action.payload };
        case 'GET_COMMENTS':
            return { ...state, comments: action.payload };
        default:
            return state;
    }
}
const profile = (state = {}, action) => {
    switch (action.type) {
        case 'GET_PROFILE':
            return action.payload
        default:
            return state
    }
}
const messages = (state = {}, action) => {
    switch (action.type) {
        case 'GET_MESSAGES':
            return action.payload
        default:
            return state
    }
}
const modal = (state = null, action) => {
    switch (action.type) {
        case 'OPEN_MODAL':
            return { ...state, modal: action.payload }
        case 'CLOSE_MODAL':
            return { ...state, modal: false }
        default:
            return state
    }
}

export default combineReducers({
    user,
    post,
    profile,
    messages,
    modal
});