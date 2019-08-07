import React from 'react';
import { ActivityIndicator, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import firebase from '../config/firebase';
import appStyle from '../styles/app.js';
import { updateEmail, updatePassword, login, getUser, facebookLogin } from '../store/actions/user';


class Login extends React.Component {
    state = { loading: false };
    componentWillMount = async () => {
        // below firebase authentication is offline, as the firebase checks for the timestamp expiry token
        // for returning user. So the function returns user even if the app is offline
        // So test case: keep the network offline and check the flow.
        // firebase.auth().onAuthStateChanged((user) => {
        //     if (user) {
        //         console.log('user ', user);
        //         // now trigger loader screen till the state updates
        //         this.props.getUser(user.uid, 'LOGIN');
        //         this.props.navigation.navigate('HomeRoute');
        //     }
        // }, (error) => {
        //     Alert.alert(
        //         'Login Error',
        //         error.message,
        //         [
        //             { text: 'OK', onPress: () => console.log('OK Presse d') },
        //         ],
        //         { cancelable: false },
        //     );
        // }, () => this.setState({ loading: false }));
    }
    componentDidUpdate = () => {
        console.log('user data in login ', this.props.user);
        if (this.props.user.uid) {
            console.log('triggering in home comp');
            this.props.navigation.navigate('HomeRoute');
        }
    }
    render() {
        if (this.state.loading) {
            return (<ActivityIndicator style={appStyle.container} />);
        }
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
                <TouchableOpacity style={appStyle.button} onPress={() => {
                    this.props.login(); this.setState({ loading: true });
                }}>
                    <Text>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={appStyle.facebookButton} onPress={() => {
                    this.props.facebookLogin(); this.setState({ loading: true });
                }}>
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


