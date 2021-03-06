import { Alert } from 'react-native';

import uuid from 'uuid'
import orderBy from 'lodash/orderBy'

import firebase from '../../config/firebase';
import { sendNotification } from './'
import StorageService from '../../services/storage-service';

// TODO: implement redo functionality so that we can implement the network call after making local changes. 
// even if the network call fails, the local changes can be reverted back
// TODO: most time is spent on updating the firestore database. Local changes are very fast
export const updateDescription = (descr) => {
  return { type: 'UPDATE_DESCRIPTION', payload: descr }
}

export const updatePostPhoto = (input) => {
  return { type: 'UPDATE_POST_PHOTO', payload: input }

}

export const updateLocation = (input) => {
  return { type: 'UPDATE_LOCATION', payload: input }
}

export const uploadPost = () => {
  return async (dispatch, getState) => {
    try {
      const { post, user } = getState();
      const id = uuid.v4();
      const userPost = {
        id: id,
        postPhoto: post.postPhoto ? post.postPhoto : '',
        location: post.location ? post.location : '',
        description: post.description ? post.description : '',
        uid: user.uid,
        username: user.username ? user.username : '', // remove as it can update from user
        photo: user.photo ? user.photo : '', // remove as it can update from user
        likes: [],
        comments: []
      };
      dispatch({ type: 'ADD_POST', payload: userPost });
      await StorageService.setPosts(getState().post);
      await firebase.firestore().collection('posts').doc(id).set(userPost);
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
      await StorageService.setPosts(array);
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

export const loadPosts = () => {
  return async (dispatch, getState) => {
    try {
      const posts = await StorageService.getPosts();
      dispatch({ type: 'GET_POSTS', payload: posts.feed });
    } catch (error) {
      Alert.alert(
        'Loading Posts Error',
        error.message,
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
        { cancelable: false },
      );
    }
  }
}

export const likePost = (post) => {
  return async (dispatch, getState) => {
    const { uid, username, photo } = getState().user
    try {
      const feed = getState().post.feed;
      for (let i = 0; i < feed.length; i++) {
        if (post.id === feed[i].id) {
          feed[i].likes.push(uid);
          break;
        }
      }
      dispatch({ type: 'GET_POSTS', payload: [...feed] });
      const posts = getState().post;
      await StorageService.setPosts(posts);
      await firebase.firestore().collection('posts').doc(post.id).update({
        likes: firebase.firestore.FieldValue.arrayUnion(uid)
      })
      await firebase.firestore().collection('activity').doc().set({
        postId: post.id,
        postPhoto: post.postPhoto,
        likerId: uid,
        likerPhoto: photo,
        likerName: username,
        uid: post.uid,
        date: new Date().getTime(),
        type: 'LIKE',
      });

      // change reference of the object to see changes in DOM
      dispatch(sendNotification(post.uid, 'Liked Your Photo'))
    } catch (e) {
      console.error(e)
    }
  }
}

export const unlikePost = (post) => {
  return async (dispatch, getState) => {
    const { uid } = getState().user
    try {
      const feed = getState().post.feed;
      const postLikes = feed.filter(item => item.id === post.id)[0].likes;
      const index = postLikes.indexOf(uid);
      if (index >= 0) {
        postLikes.splice(index, 1);
      }
      dispatch({ type: 'GET_POSTS', payload: [...feed] })
      const posts = getState().post;
      await StorageService.setPosts(posts);
      await firebase.firestore().collection('posts').doc(post.id).update({
        likes: firebase.firestore.FieldValue.arrayRemove(uid)
      })
      const query = await firebase.firestore().collection('activity').where('postId', '==', post.id).where('likerId', '==', uid).get()
      query.forEach((response) => {
        response.ref.delete()
      });
    } catch (e) {
      console.error(e)
    }
  }
}

export const getComments = (post) => (
  { type: 'GET_COMMENTS', payload: orderBy(post.comments, 'date', 'desc') }
)

export const addComment = (text, post) => {
  return async (dispatch, getState) => {
    const { uid, photo, username } = getState().user
    let comments = getState().post.comments.reverse();
    try {
      const comment = {
        comment: text,
        commenterId: uid,
        commenterPhoto: photo || '',
        commenterName: username,
        date: new Date().getTime(),
      }
      comment.postId = post.id
      comment.postPhoto = post.postPhoto
      comment.uid = post.uid
      comment.type = 'COMMENT'
      comments.push(comment);
      comments.reverse();

      const feed = getState().post.feed;
      for (let i = 0; i < feed.length; i++) {
        if (post.id === feed[i].id) {
          feed[i].comments = [...comments]
          break;
        }
      }
      dispatch({ type: 'GET_COMMENTS', payload: [...comments] });
      dispatch({ type: 'GET_POSTS', payload: [...feed] })
      await StorageService.setPosts(getState().post);
      await firebase.firestore().collection('posts').doc(post.id).update({
        comments: firebase.firestore.FieldValue.arrayUnion(comment)
      })
      await firebase.firestore().collection('activity').doc().set(comment);
      dispatch(sendNotification(post.uid, text))
    } catch (e) {
      console.error(e)
    }
  }
}