import React from 'react';
import { Text, View, TextInput, TouchableOpacity } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import appStyle from '../styles/app.js';
import { updateEmail, updatePassword, updateUsername, updateBio, signup } from '../store/actions/user';


class Signup extends React.Component {
    signup = () => {
        // now trigger loader screen till the state updates 
        this.props.signup();
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
                />
                <TextInput
                    style={appStyle.border}
                    value={this.props.user.username}
                    onChangeText={(input) => this.props.updateUsername(input)}
                    placeholder='User Name'
                />
                <TextInput
                    style={appStyle.border}
                    value={this.props.user.bio}
                    onChangeText={(input) => this.props.updateBio(input)}
                    placeholder='Bio'
                />
                <TouchableOpacity
                    style={appStyle.button} onPress={() => this.signup()}>
                    <Text>Signup</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const mapStateToProps = (state) => ({ user: state.user });

const mapDispatchToProps = (dispatch) => bindActionCreators({
    updateEmail, updatePassword, updateUsername, updateBio, signup
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Signup);


