import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getLocalStorage } from '../store/actions';

class AuthLoadingScreen extends React.Component {
    constructor(props) {
        super(props);
        this._bootstrapAsync();
    }

    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = () => {
        this.props.getLocalStorage();
    };

    componentDidUpdate = () => {
        // This will switch to the App screen or Auth screen and this loading
        // screen will be unmounted and thrown away.
        if (this.props.user.uid) {
            this.props.navigation.navigate('HomeRoute');
        } else {
            this.props.navigation.navigate('AuthRoute');
        }
    }

    // Render any loading content that you like here
    render() {
        return (
            <View>
                <ActivityIndicator />
                <StatusBar barStyle="default" />
            </View>
        );
    }
}
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ getLocalStorage }, dispatch)
}

const mapStateToProps = (state) => ({user: state.user})

export default connect(mapStateToProps, mapDispatchToProps)(AuthLoadingScreen)