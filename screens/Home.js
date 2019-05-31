import React from 'react';
import { Text, View, Button } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { add, subtract } from '../store/actions';
import appStyle from '../styles/app.js';

class Home extends React.Component {

  render() {
    return (
      <View style={appStyle.container}>
        <Text>Home {this.props.counter}</Text>
        <Button title='Add' onPress={() => this.props.add()} />
        <Text>Not working</Text>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({ counter: state.counter });

const mapDispatchToProps = (dispatch) => bindActionCreators({ add, subtract }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Home);


