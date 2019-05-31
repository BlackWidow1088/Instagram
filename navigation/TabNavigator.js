
import React from 'react';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

import Home from '../screens/Home';
import Search from '../screens/Search';
import Upload from '../screens/Upload';
import Activity from '../screens/Activity';
import Profile from '../screens/Profile';

const TabNavigator = createBottomTabNavigator({
    Home: {
        screen: Home,
        navigationOptions: {
            tabBarLabel: ' ',
            tabBarIcon: ({ focussed }) => <Ionicons name={focussed ? 'ios-home' : 'md-home'} size={32} />
        }
    },
    Search: {
        screen: Search,
        navigationOptions: {
            tabBarLabel: ' ',
            tabBarIcon: () => <Ionicons name={'md-search'} size={32} />
        }
    },
    Upload: {
        screen: Upload,
        navigationOptions: {
            tabBarLabel: ' ',
            tabBarIcon: ({ focussed }) => <Ionicons name={focussed ? 'md-add-circle' : 'md-add-circle-outline'} size={32} />
        }
    },
    Activity: {
        screen: Activity,
        navigationOptions: {
            tabBarLabel: ' ',
            tabBarIcon: ({ focussed }) => <Ionicons name={focussed ? 'md-heart' : 'md-heart-empty'} size={32} />
        }
    },
    Profile: {
        screen: Profile,
        navigationOptions: {
            tabBarLabel: ' ',
            tabBarIcon: () => <AntDesign name={'user'} size={32} />
        }
    }
});

export default createAppContainer(TabNavigator);