import React from 'react';
import { Text, View, Button, Image } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { signout } from '../store/actions/user';
import appStyle from '../styles/app.js';

class Profile extends React.Component {
  signout = () => {
    // now trigger loader screen till the state updates
    this.props.signout();
  }
  componentDidUpdate = () => {
    if (!this.props.user.uid) {
      // stop loading screen and navigate
      this.props.navigation.navigate('LoginRoute');
    }
  }
  render() {
    return (
      <View style={appStyle.container}>
        <Text>Profile</Text>
        <Image style={appStyle.profilePhoto} source={{ uri: this.props.user.photo }} />
        <Text>{this.props.user.email}</Text>
        <Text>{this.props.user.username}</Text>
        <Text>{this.props.user.bio}</Text>
        <Button style={appStyle.button} title='Signout' onPress={() => this.signout()} />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({ user: state.user });

const mapDispatchToProps = (dispatch) => bindActionCreators({ signout }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

