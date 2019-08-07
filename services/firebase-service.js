import firebase from '../config/firebase';
import { ENV } from '../env';
class FirebaseService {
    constructor() {
        console.log('calling firebase service')
    }
    getUser = async (uid) => {
        const userQuery = await firebase.firestore().collection('users').doc(uid).get();
        return userQuery.data();
    }
}

export default new FirebaseService();