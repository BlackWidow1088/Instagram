
import uuid from 'uuid'
import { Permissions, ImageManipulator, Notifications } from 'expo';
const PUSH_ENDPOINT = 'https://exp.host/--/api/v2/push/send'

import firebase from '../../config/firebase';
import StorageService from '../../services/storage-service';

export const uploadPhoto = (image) => {
  return async (dispatch) => {
    try {
      const resize = await ImageManipulator.manipulateAsync(image.uri, [], { format: 'jpg', compress: 0.1 })
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.onload = () => resolve(xhr.response)
        xhr.responseType = 'blob'
        xhr.open('GET', resize.uri, true)
        xhr.send(null)
      });
      const uploadTask = await firebase.storage().ref().child(uuid.v4()).put(blob)
      const downloadURL = await uploadTask.ref.getDownloadURL()
      return downloadURL
    } catch (e) {
      console.error(e)
      return null;
    }
  }
}

export const allowNotifications = () => {
  return async (dispatch, getState) => {
    const { uid } = getState().user
    try {
      const permission = await Permissions.askAsync(Permissions.NOTIFICATIONS)
      if (permission.status === 'granted') {
        const token = await Notifications.getExpoPushTokenAsync()
        dispatch({ type: 'GET_TOKEN', payload: token })
        firebase.firestore().collection('users').doc(uid).update({ token: token })
      }
    } catch (e) {
      console.log('catching error in allowing notifications');
      console.error(e)
    }
  }
}

export const sendNotification = (uid, text) => {
  return async (dispatch, getState) => {
    const { username } = getState().user
    try {
      const user = await firebase.firestore().collection('users').doc(uid).get()
      if (user.data().token) {
        fetch(PUSH_ENDPOINT, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: user.data().token,
            title: username,
            body: text,
          })
        })
      }
    } catch (e) {
      console.error(e)
    }
  }
}

export const getLocalStorage = () => {
  return async (dispatch) => {
    try {
      const { user, post } = await StorageService.getStorage();
      console.log('user ', user)
      dispatch({ type: 'LOGIN', payload: user ? user : {} });
      dispatch({ type: 'GET_POSTS', payload: post ? post : {} });
    } catch (err) {
      dispatch({ type: 'LOGIN', payload: {} });
      dispatch({ type: 'GET_POSTS', payload: {} });
      console.log('error in loading local data')
    }
  }
}