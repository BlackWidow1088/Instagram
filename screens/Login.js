import React from 'react';
import { Text, View, TextInput, TouchableOpacity, Button } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import appStyle from '../styles/app.js';
import { updateEmail, updatePassword } from '../store/actions';


class Login extends React.Component {
    login = () => {
        if (this.props.user.email) {
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
                <Button title='Login' style={appStyle.button} onPress={() => this.login()} />
                <TouchableOpacity style={appStyle.button} onPress={() => this.props.navigation.navigate('SignupRoute')}>
                    <Text>Signup</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const mapStateToProps = (state) => ({ user: state.user });

const mapDispatchToProps = (dispatch) => bindActionCreators({ updateEmail, updatePassword }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Login);


