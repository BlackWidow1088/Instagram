import React from 'react';
import { Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import firebase from '../config/firebase';
import appStyle from '../styles/app.js';
import { updateEmail, updatePassword, login, getUser, facebookLogin } from '../store/actions/user';


import { Permissions, ImageManipulator, Notifications } from 'expo';
const PUSH_ENDPOINT = 'https://exp.host/--/api/v2/push/send'

class Login extends React.Component {
    componentDidMount = async () => {
        // below firebase authentication is offline, as the firebase checks for the timestamp expiry token
        // for returning user. So the function returns user even if the app is offline
        // So test case: keep the network offline and check the flow.
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                // now trigger loader screen till the state updates
                this.props.getUser(user.uid, 'LOGIN')
            }
        }, (error) => {
            Alert.alert(
                'Login Error',
                error.message,
                [
                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                ],
                { cancelable: false },
            );
        })
    }
    componentDidUpdate = () => {
        if (this.props.user.uid) {
            // stop loading screen and navigate
            this.props.navigation.navigate('HomeRoute');
        }
    }
    render() {
        return (
            <View style={[appStyle.container, appStyle.center]}>
                <Image style={{ width: 300, height: 100 }} source={require('../assets/instagram.jpg')} />
                <TextInput
                    style={appStyle.border}
                    value={this.props.user.email}
                    onChangeText={input => this.props.updateEmail(input)}
                    placeholder='Email'
                />
                <TextInput
                    style={appStyle.border}
                    value={this.props.user.password}
                    onChangeText={input => this.props.updatePassword(input)}
                    placeholder='Password'
                    secureTextEntry={true}
                />
                <TouchableOpacity style={appStyle.button} onPress={() => this.props.login()}>
                    <Text>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={appStyle.facebookButton} onPress={() => this.props.facebookLogin()}>
                    <Text style={appStyle.white}>Facebook Login</Text>
                </TouchableOpacity>
                <Text style={{ margin: 20 }}>OR</Text>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('SignupRoute')}>
                    <Text>Signup</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const mapStateToProps = (state) => ({ user: state.user });

const mapDispatchToProps = (dispatch) => bindActionCreators({ updateEmail, updatePassword, login, getUser, facebookLogin }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Login);


