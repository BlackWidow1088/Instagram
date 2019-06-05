import React from 'react';
import { Text, View, TextInput, TouchableOpacity, Button } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import firebase from '../config/firebase';
import appStyle from '../styles/app.js';
import { updateEmail, updatePassword, login, getUser, facebookLogin } from '../store/actions/user';

class Login extends React.Component {
    componentDidMount = () => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                // now trigger loader screen till the state updates
                this.props.getUser(user.uid);
            }
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
            <View style={appStyle.container}>
                <TextInput
                    style={appStyle.border}
                    value={this.props.user.email}
                    onChangeText={(input) => this.props.updateEmail(input)}
                    placeholder='Email'
                />
                <TextInput
                    style={appStyle.border}
                    value={this.props.user.password}
                    onChangeText={(input) => this.props.updatePassword(input)}
                    placeholder='Password'
                    secureTextEntry={true}
                />
                <Button title='Login' style={appStyle.button} onPress={() => this.props.login()} />
                <Button title='Facebook Login' style={appStyle.button} onPress={() => this.props.facebookLogin()} />
                <TouchableOpacity style={appStyle.button} onPress={() => this.props.navigation.navigate('SignupRoute')}>
                    <Text>Signup</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const mapStateToProps = (state) => ({ user: state.user });

const mapDispatchToProps = (dispatch) => bindActionCreators({ updateEmail, updatePassword, login, getUser, facebookLogin }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Login);


