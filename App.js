import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware  from 'redux-thunk';
//  makes app slow in debugger mode
// import logger from 'redux-logger';

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
