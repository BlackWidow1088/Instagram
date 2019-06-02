import { Alert } from 'react-native';
import { Facebook } from 'expo';

import firebase from '../../config/firebase';
import { ENV } from '../../env';

export const updateEmail = (email) => {
    return { type: 'UPDATE_EMAIL', payload: email }
}

export const updatePassword = (pass) => {
    return { type: 'UPDATE_PASSWORD', payload: pass }
}

export const updateUsername = (username) => {
    return { type: 'UPDATE_USERNAME', payload: username }
}

export const updateBio = (bio) => {
    return { type: 'UPDATE_BIO', payload: bio }
}


// need to study on how multi type works: 1) we can return object 2) return async/ sync function and dispatch action object or another 
// function
export const login = () => {
    return async (dispatch, getState) => {
        try {
            const { email, password } = getState().user;
            const response = await firebase.auth().signInWithEmailAndPassword(email, password);
            if (response.user.uid) {
                dispatch(getUser(response.user.uid));
            }
        } catch (error) {
            Alert.alert(
                'Login Error',
                error.message,
                [
                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                ],
                { cancelable: false },
            );
        }
    }
}

export const facebookLogin = () => {
    return async (dispatch) => {
        try {
            const {
                type,
                token,
                expires,
                permissions,
                declinedPermissions,
            } = await Facebook.logInWithReadPermissionsAsync(ENV.appId);
            if (type === 'success') {
                // Build Firebase credential with the Facebook auth token.
                const credential = await firebase.auth.FacebookAuthProvider.credential(token);
                // Sign in with the credential from the Facebook user.
                const response = await firebase.auth().signInAndRetrieveDataWithCredential(credential);
                if (response.user.uid) {
                    let user = await firebase.firestore().collection('users').doc(response.user.uid).get();
                    if (user.exists) {
                        dispatch({ type: 'LOGIN', payload: user.data() });
                    } else {
                        user = {
                            uid: response.user.uid,
                            email: response.user.email,
                            username: response.user.displayName,
                            bio: '',
                            photo: response.user.photoURL
                        };
                        await firebase.firestore().collection('users').doc(response.user.uid).set(user);
                        dispatch({ type: 'LOGIN', payload: user });
                    }
                }
            }
        } catch (error) {
            Alert.alert(
                'Login Error',
                error.message,
                [
                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                ],
                { cancelable: false },
            );
        }
    }
}
// best practice: handle the exception related to this function in this function itself
export const getUser = (uid) => {
    return async (dispatch, getState) => {
        try {
            const user = await firebase.firestore().collection('users').doc(uid).get();
            dispatch({ type: 'LOGIN', payload: user.data() });
        } catch (error) {
            Alert.alert(
                'Login Error',
                error.message,
                [
                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                ],
                { cancelable: false },
            );
        }
    }
}

export const signup = () => {
    return async (dispatch, getState) => {
        try {
            const { email, password, username, bio } = getState().user;
            const response = await firebase.auth().createUserWithEmailAndPassword(email, password);
            if (response.user.uid) {
                const user = {
                    uid: response.user.uid,
                    email: email,
                    username: username,
                    bio: bio ? bio : '',
                    photo: ''
                };
                await firebase.firestore().collection('users').doc(response.user.uid).set(user);
                dispatch({ type: 'LOGIN', payload: user })
            }
        } catch (error) {
            Alert.alert(
                'Signup Error',
                error.message,
                [
                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                ],
                { cancelable: false },
            );
        }
    }
}

export const signout = () => {
    return (dispatch, getState) => {
        try {
            const response = firebase.auth().signOut();
            dispatch({ type: 'SIGNOUT', payload: null });
        } catch (error) {
            Alert.alert(
                'Signout Error',
                error.message,
                [
                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                ]
            );
        }
    };
}
