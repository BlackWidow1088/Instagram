import { AsyncStorage } from 'react-native';
class StorageService {
    constructor() {
        console.log('calling Storage again')
    }
    getStorage = async () => {
        const user = await this.getUser();
        const post = await this.getPosts();
        return { user, post };
    }
    setStorage = async ({user, post}) => {
        await this.setUser(user);
        await this.setPosts(post);
    }
    clearStorage = async () => {
        await AsyncStorage.removeItem('user');
        await AsyncStorage.removeItem('post');
    }

    getUser = async () => {
        const user = await AsyncStorage.getItem('user');
        return JSON.parse(user);
    }
    setUser = async (user) => {
        await AsyncStorage.setItem('user', JSON.stringify(user));
        console.log('user in storage ', user)
    }

    getPosts = async () => {
        const post = await AsyncStorage.getItem('post');
        return JSON.parse(post);
    }
    setPosts = async (post) => {
        await AsyncStorage.setItem('post', JSON.stringify(post));
    }
}

export default new StorageService();