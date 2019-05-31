
import { createStackNavigator, createAppContainer } from 'react-navigation';
import Login from '../screens/Login';
import Signup from '../screens/Signup';

const AuthNavigator = createStackNavigator({
    LoginRoute: {
        screen: Login,
        navigationOptions: {
            header: null
        }
    },
    SignupRoute: {
        screen: Signup
    }
});

export default createAppContainer(AuthNavigator);