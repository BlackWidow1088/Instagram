import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware  from 'redux-thunk';

//  makes app slow in debugger mode
// import logger from 'redux-logger';

// initialise firebase in the app
// just importing will trigger initialisation of firebase.
import firebase from './config/firebase';

import { YellowBox } from 'react-native';

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = { ...console }
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

import reducer from './store/reducers';
import SwitchNavigator from './navigation/SwitchNavigator';
const store = createStore(reducer, applyMiddleware(thunkMiddleware))

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <SwitchNavigator />
      </Provider>
    );
  }
}
