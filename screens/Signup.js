import React from 'react';
import { Text, View, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import appStyle from '../styles/app.js';
import { updatePhoto, updateUser, updateEmail, updatePassword, updateUsername, updateBio, signup } from '../store/actions/user';
import { uploadPhoto } from '../store/actions';
import MobileService from '../services/mobile-service';

class Signup extends React.Component {
    state = { loading: false };
    componentDidUpdate = () => {
        const { routeName } = this.props.navigation.state 
        if (routeName === 'SignupRoute' && this.props.user.uid) {
            // stop loading screen and navigate
            this.setState({ loading: false });
            this.props.navigation.navigate('HomeRoute');
        }
    }
    onPress = () => {
        // now trigger loader screen till the state updates
        this.setState({ loading: true });
        const { routeName } = this.props.navigation.state
        if (routeName === 'SignupRoute') {
            this.props.signup()
        } else {
            this.props.updateUser()
            this.props.navigation.goBack()
        }
    }
    openLibrary = async () => {
        this.setState({ loading: true });
        const image = await MobileService.openLibrary();
        const url = await this.props.uploadPhoto(image)
        this.props.updatePhoto(url)
    }
    render() {
        const { routeName } = this.props.navigation.state
        return this.state.loading ?
            (<View style={[appStyle.container, appStyle.center]}>
                <ActivityIndicator style={appStyle.center} />
            </View>) :
            (<View style={[appStyle.container, appStyle.center]}>
                <TouchableOpacity style={appStyle.center} onPress={this.openLibrary} >
                    <Image style={appStyle.roundImage} source={{ uri: this.props.user.photo }} />
                    <Text style={appStyle.bold}>Upload Photo</Text>
                </TouchableOpacity>
                <TextInput
                    style={appStyle.border}
                    editable={routeName === 'SignupRoute' ? true : false}
                    value={this.props.user.email}
                    onChangeText={(input) => this.props.updateEmail(input)}
                    placeholder='Email'
                />
                <TextInput
                    style={appStyle.border}
                    editable={routeName === 'SignupRoute' ? true : false}
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
                <TouchableOpacity style={appStyle.button} onPress={this.onPress}>
                    <Text>{routeName === 'SignupRoute' ? 'Signup' : 'Done'}</Text>
                </TouchableOpacity>
            </View>
            );
    }
}

const mapStateToProps = (state) => ({ user: state.user });

const mapDispatchToProps = (dispatch) => bindActionCreators({
    uploadPhoto, updatePhoto, updateUser, updateEmail, updatePassword, updateUsername, updateBio, signup
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Signup);


