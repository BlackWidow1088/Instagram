
import React from 'react';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';

import { HomeNavigator, SearchNavigator, PostNavigator, ActivityNavigator, ProfileNavigator } from './StackNavigator'

const TabNavigator = createBottomTabNavigator(
  {
    Home: {
      screen: HomeNavigator,
      navigationOptions: {
        tabBarLabel: ' ',
        tabBarIcon: () => (
          <Ionicons name='ios-home' size={32} />
        )
      }
    },
    Search: {
      screen: SearchNavigator,
      navigationOptions: {
        tabBarLabel: ' ',
        tabBarIcon: () => (
          <Ionicons name='ios-search' size={32} />
        )
      }
    },
    Post: {
      screen: PostNavigator,
      navigationOptions: {
        tabBarLabel: ' ',
        tabBarIcon: () => (
          <Ionicons name='ios-add-circle-outline' size={32} />
        )
      }
    },
    Activity: {
      screen: ActivityNavigator,
      navigationOptions: {
        tabBarLabel: ' ',
        tabBarIcon: ({ focused }) => (
          <Ionicons name={focused ? 'ios-heart' : 'ios-heart-empty'} size={32} />
        )
      }
    },
    Profile: {
      screen: ProfileNavigator,
      navigationOptions: {
        tabBarLabel: ' ',
        tabBarIcon: () => (
          <Ionicons name='ios-person' size={32} />
        )
      }
    }
  },
  {
    tabBarOptions: {
      style: {
        paddingVertical: 10,
        height: 60
      }
    }
  }
);

export default createAppContainer(TabNavigator);