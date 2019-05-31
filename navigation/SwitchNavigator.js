
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import TabNavigator from './TabNavigator';
import AuthNavigator from './AuthNavigator';

const SwitchNavigator = createSwitchNavigator({
    HomeRoute: {
        screen: TabNavigator
    },
    AuthRoute: {
        screen: AuthNavigator
    }
},
    {
        initialRouteName: 'AuthRoute'
    });

export default createAppContainer(SwitchNavigator);