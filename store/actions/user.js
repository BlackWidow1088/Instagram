import { Alert } from 'react-native';
import { Facebook } from 'expo';
import orderBy from 'lodash/orderBy';

import firebase from '../../config/firebase';
import { ENV } from '../../env';
import { allowNotifications, sendNotification } from '../actions';
import StorageService from '../../services/storage-service';

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

export const updatePhoto = (photo) => {
    return { type: 'UPDATE_PHOTO', payload: photo }
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
                dispatch(allowNotifications());
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
                        const data = user.data();
                        dispatch({ type: 'LOGIN', payload: data });
                        console.log('facebook login ', data)
                        await StorageService.setUser(data);
                    } else {
                        user = {
                            uid: response.user.uid,
                            email: response.user.email,
                            username: response.user.displayName,
                            bio: '',
                            photo: response.user.photoURL,
                            token: null,
                            followers: [],
                            following: []
                        };
                        await firebase.firestore().collection('users').doc(response.user.uid).set(user);
                        dispatch(allowNotifications());
                        dispatch({ type: 'LOGIN', payload: user });
                        await StorageService.setUser(user);
                    }
                }
            }
        } catch (error) {
            Alert.alert(
                'Facebook Login Error',
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
export const getUser = (uid, type) => {
    return async (dispatch, getState) => {
        try {
            const userQuery = await firebase.firestore().collection('users').doc(uid).get();
            const user = userQuery.data();
            if (type === 'LOGIN') {
                dispatch({ type: 'LOGIN', payload: user });
                await StorageService.setUser(user);
            } else {
                dispatch({ type: 'GET_PROFILE', payload: user })
            }
        } catch (error) {
            Alert.alert(
                'User not found error',
                error.message,
                [
                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                ],
                { cancelable: false },
            );
        }
    }
}

export const getUserPosts = (type) => {
    return async (dispatch, getState) => {
        let user = {};
        if(type === 'LOGIN') {
            user = getState().user;
        } else {
            user = getState().profile;
        }
        let posts = []
        const postsQuery = await firebase.firestore().collection('posts').where('uid', '==', user.uid).get()
        postsQuery.forEach(function (response) {
            posts.push(response.data())
        })
        user.posts = orderBy(posts, 'date', 'desc');

        if (type === 'LOGIN') {
            dispatch({ type: 'LOGIN', payload: user });
            await StorageService.setUser(user);
        } else {
            dispatch({ type: 'GET_PROFILE', payload: user })
        }
    }
}

export const updateUser = () => {
    return async (dispatch, getState) => {
        const { uid, username, bio, photo } = getState().user
        try {
            firebase.firestore().collection('users').doc(uid).update({
                username: username,
                bio: bio,
                photo: photo
            });
            updateUsername(username);
            updateBio(bio);
            updatePhoto(photo);
            dispatch({ type: 'LOGIN', payload: getState().user });
            await StorageService.setUser(getState().user);
        } catch (e) {
            alert(e)
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
                    photo: '',
                    token: null,
                    followers: [],
                    following: []
                };
                await firebase.firestore().collection('users').doc(response.user.uid).set(user);
                dispatch({ type: 'LOGIN', payload: user });
                await StorageService.setUser(user);
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
    return async (dispatch, getState) => {
        try {
            const response = await firebase.auth().signOut();
            dispatch({ type: 'SIGNOUT' });
            await StorageService.clearStorage();
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

export const followUser = (user) => {
    return async (dispatch, getState) => {
        const { uid, photo, username } = getState().user
        try {
            firebase.firestore().collection('users').doc(user.uid).update({
                followers: firebase.firestore.FieldValue.arrayUnion(uid)
            })
            firebase.firestore().collection('users').doc(uid).update({
                following: firebase.firestore.FieldValue.arrayUnion(user.uid)
            })
            firebase.firestore().collection('activity').doc().set({
                followerId: uid,
                followerPhoto: photo,
                followerName: username,
                uid: user.uid,
                photo: user.photo,
                username: user.username,
                date: new Date().getTime(),
                type: 'FOLLOWER',
            })
            dispatch(sendNotification(user.uid, 'Started Following You'))
            dispatch(getUser(user.uid))
        } catch (e) {
            console.error(e)
        }
    }
}

export const unfollowUser = (user) => {
    return async (dispatch, getState) => {
        const { uid, photo, username } = getState().user
        try {
            firebase.firestore().collection('users').doc(user.uid).update({
                followers: firebase.firestore.FieldValue.arrayRemove(uid)
            })
            firebase.firestore().collection('users').doc(uid).update({
                following: firebase.firestore.FieldValue.arrayRemove(user.uid)
            })
            dispatch(getUser(user.uid))
        } catch (e) {
            console.error(e)
        }
    }
}