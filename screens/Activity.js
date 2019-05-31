import React from 'react';
import {Text, View } from 'react-native';
import appStyle from '../styles/app.js';
import Dashboard from './Dashboard.js';

export default class Activity  extends React.Component {
  render() {
    return (
      <View style={appStyle.container}>
        <Text> Activity Page </Text>
        <Dashboard counter = {10}/>
      </View>
    );
  }  
}


