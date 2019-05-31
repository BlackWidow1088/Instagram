import React from 'react';
import {Text, View } from 'react-native';

export default class Dashboard extends React.Component {
  render() {
    return (
      <View>
        <Text> Dashboard Page  {this.props.counter}</Text>
      </View>
    )
  }
}


