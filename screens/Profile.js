import React from 'react';
import { Text, View } from 'react-native';
import appStyle from '../styles/app.js';

export default class Profile extends React.Component {
  render() {
    return (
      <View style={appStyle.container}>
        <Text>Profile</Text>
      </View>
    );
  }
}


