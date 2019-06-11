import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { View, Text, SafeAreaView, TextInput, FlatList, Image, TouchableOpacity } from 'react-native';

import appStyle from '../styles/app';
import firebase from '../config/firebase';
import { getUser } from '../store/actions/user';

class Search extends React.Component {
  state = {
    search: '',
    query: []
  }

  searchUser = async () => {
    let search = []
    const query = await firebase.firestore().collection('users').where('username', '>=', this.state.search).get()
    query.forEach((response) => {
      search.push(response.data())
    })
    this.setState({ query: search })
  }

  goToUser = (user) => {
    this.props.getUser(user.uid)
    this.props.navigation.navigate('Profile')
  }

  render() {
    return (
      <SafeAreaView style={appStyle.container}>
        <TextInput
          style={appStyle.input}
          onChangeText={(search) => this.setState({ search })}
          value={this.state.search}
          returnKeyType='send'
          placeholder='Search'
          onSubmitEditing={this.searchUser} />
        <FlatList
          data={this.state.query}
          keyExtractor={(item) => JSON.stringify(item.uid)}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => this.goToUser(item)} style={[appStyle.row, appStyle.space]}>
              <Image style={appStyle.roundImage} source={{ uri: item.photo }} />
              <View style={[appStyle.container, appStyle.left]}>
                <Text style={appStyle.bold}>{item.username}</Text>
                <Text style={appStyle.gray}>{item.bio}</Text>
              </View>
            </TouchableOpacity>
          )} />
      </SafeAreaView>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ getUser }, dispatch)
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Search)