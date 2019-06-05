import { Alert } from 'react-native';

import firebase from '../../config/firebase';
import uuid from 'uuid'

export const updateDescription = (descr) => {
    return { type: 'UPDATE_DESCRIPTION', payload: descr }
}

export const updatePhoto = (input) => {
    return { type: 'UPDATE_PHOTO', payload: input }
}

export const updateLocation = (input) => {
    return { type: 'UPDATE_LOCATION', payload: input }
}

export const uploadPhoto = (image) => {
    return async (dispatch) => {
        try {
            const blob = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest()
                xhr.onload = () => resolve(xhr.response)
                xhr.responseType = 'blob'
                xhr.open('GET', image.uri, true)
                xhr.send(null)
            });
            const uploadTask = await firebase.storage().ref().child(uuid.v4()).put(blob)
            const downloadURL = await uploadTask.ref.getDownloadURL()
            return downloadURL
        } catch (e) {
            console.error(e)
        }
    }
}

export const uploadPost = () => {
    return async (dispatch, getState) => {
        try {
            const { post, user } = getState();
            const id = uuid.v4();
            const userPost = {
                postPhoto: post.photo,
                location: post.location,
                id: id,
                description: post.description,
                uid: user.uid,
                username: user.username,
                photo: user.photo,
            };
            await firebase.firestore().collection('posts').doc(id).set(userPost);
            dispatch({ type: 'ADD_POST', payload: userPost });
        } catch (error) {
            Alert.alert(
                'Post Upload Error',
                error.message,
                [
                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                ],
                { cancelable: false },
            );
        }
    }
}

export const getPosts = () => {
    return async (dispatch, getState) => {
        try {
            const posts = await firebase.firestore().collection('posts').get();
            let array = [];
            posts.forEach(post => array.push(post.data()));
            dispatch({ type: 'GET_POSTS', payload: array });
        } catch (error) {
            Alert.alert(
                'Get all Posts Error',
                error.message,
                [
                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                ],
                { cancelable: false },
            );
        }
    }
}