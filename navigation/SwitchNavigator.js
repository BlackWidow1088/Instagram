
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import TabNavigator from './TabNavigator';
import AuthNavigator from './AuthNavigator';
import AuthLoadingScreen from '../screens/AuthLoading';

const SwitchNavigator = createSwitchNavigator({
    HomeRoute: {
        screen: TabNavigator
    },
    AuthRoute: {
        screen: AuthNavigator
    },
    AuthLoadingRoute: {
      screen: AuthLoadingScreen,
    }
},
    {
        initialRouteName: 'AuthLoadingRoute'
    });

export default createAppContainer(SwitchNavigator);