import React from 'react';
import { Text, View, Image, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { signout } from '../store/actions/user';
import appStyle from '../styles/app.js';
import { followUser, unfollowUser } from '../store/actions/user'

class Profile extends React.Component {
  follow = (user) => {
    if (user.followers.indexOf(this.props.user.uid) >= 0) {
      this.props.unfollowUser(user)
    } else {
      this.props.followUser(user)
    }
  }

  signout = () => {
    // now trigger loader screen till the state updates
    this.props.signout();
  }
  componentDidUpdate = () => {
    if (this.props.navigation.state.routeName === 'MyProfile' && !this.props.user.uid) {
      // stop loading screen and navigate
      this.props.navigation.navigate('LoginRoute');
    }
  }

  render() {
    let user = {}
    const { state, navigate } = this.props.navigation
    if (state.routeName === 'Profile') {
      user = this.props.profile
    } else {
      user = this.props.user
    }
    if (!user.posts) return <ActivityIndicator style={appStyle.container} />
    return (
      <View style={[appStyle.container, appStyle.center]}>
        <View style={[appStyle.row, appStyle.space, { paddingHorizontal: 20 }]}>
          <View style={appStyle.center}>
            <Image style={appStyle.roundImage} source={{ uri: user.photo }} />
            <Text>{user.username}</Text>
            <Text>{user.bio}</Text>
          </View>
          <View style={appStyle.center}>
            <Text style={appStyle.bold}>{user.posts.length}</Text>
            <Text>posts</Text>
          </View>
          <View style={appStyle.center}>
            <Text style={appStyle.bold}>{user.followers.length}</Text>
            <Text>followers</Text>
          </View>
          <View style={appStyle.center}>
            <Text style={appStyle.bold}>{user.following.length}</Text>
            <Text>following</Text>
          </View>
        </View>
        <View style={appStyle.center}>
          {
            state.routeName === 'MyProfile' ?
              <View style={appStyle.row}>
                <TouchableOpacity style={appStyle.buttonSmall} onPress={() => this.props.navigation.navigate('Edit')}>
                  <Text style={appStyle.bold}>Edit Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={appStyle.buttonSmall} onPress={() => this.signout()}>
                  <Text style={appStyle.bold}>Logout</Text>
                </TouchableOpacity>
              </View> :
              <View style={appStyle.row}>
                <TouchableOpacity style={appStyle.buttonSmall} onPress={() => this.follow(user)}>
                  <Text style={appStyle.bold}>{user.followers.indexOf(this.props.user.uid) >= 0 ? 'UnFollow User' : 'Follow User'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={appStyle.buttonSmall} onPress={() => this.props.navigation.navigate('Chat', user.uid)}>
                  <Text style={appStyle.bold}>Message</Text>
                </TouchableOpacity>
              </View>
          }
        </View>
        <FlatList
          style={{ paddingTop: 25 }}
          horizontal={false}
          numColumns={3}
          data={user.posts}
          keyExtractor={(item) => JSON.stringify(item.date)}
          renderItem={({ item }) => <Image style={appStyle.squareLarge} source={{ uri: item.postPhoto }} />} />
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ followUser, unfollowUser, signout }, dispatch)
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    profile: state.profile
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)