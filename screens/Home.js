import React from 'react';
import { Text, View, Image, FlatList, TouchableOpacity } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';

import appStyle from '../styles/app.js';
import { getPosts, likePost, unlikePost } from '../store/actions/post';
class Home extends React.Component {
  componentDidMount = () => {
    // call loader till the images are getting loaded
    //  or show cached images for the user
    this.props.getPosts();
  }
  likePost = (post) => {
    const { uid } = this.props.user
    if (post.likes.includes(uid)) {
      this.props.unlikePost(post)
    } else {
      this.props.likePost(post)
    }
  }
  navigateMap = (item) => {
    this.props.navigation.navigate('Map',
      { location: item.location }
    )
  }

  render() {
    // important: the tabnavigator keeps the components alive. So, whenever the states connected with this component i.e post is updated,
    // component lifecycle triggers in. 
    if (this.props.post === null) return null
    // stop loader
    return (
      <View style={appStyle.container}>
        {/* <ScrollView>
          {this.props.post.feed.map(item => 
           <View>
             <Image style={appStyle.postImage} source={{uri: item.postPhoto}}></Image>
             <Text>{item.description}</Text>
           </View> 
          )}
        </ScrollView> */}
        <FlatList
          // onRefresh={() => this.props.getPosts()}
          // refreshing={false}
          data={this.props.post.feed}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const liked = item.likes.includes(this.props.user.uid)
            return (
              <View>
                <View style={[appStyle.row, appStyle.space]}>
                  <View style={[appStyle.row, appStyle.center]}>
                    <Image style={appStyle.roundImage} source={{ uri: item.photo }} />
                    <View>
                      <Text style={appStyle.bold}>{item.username}</Text>
                      <Text style={[appStyle.gray, appStyle.small]}>{moment(item.date).format('ll')}</Text>
                      <TouchableOpacity onPress={() => this.navigateMap(item)} >
                        <Text>{item.location ? item.location.name : null}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Ionicons style={{ margin: 5 }} name='ios-flag' size={25} />
                </View>
                <TouchableOpacity onPress={() => this.likePost(item)} >
                  <Image style={appStyle.postPhoto} source={{ uri: item.postPhoto }} />
                </TouchableOpacity>
                <View style={appStyle.row}>
                  <Ionicons style={{ margin: 5 }} color={liked ? '#db565b' : '#000'} name={liked ? 'ios-heart' : 'ios-heart-empty'} size={25} />
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('Comment', item)} >
                    <Ionicons style={{ margin: 5 }} name='ios-chatbubbles' size={25} />
                  </TouchableOpacity>
                  <Ionicons style={{ margin: 5 }} name='ios-send' size={25} />
                </View>
                <Text>{item.description}</Text>
              </View>
            )
          }}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({ user: state.user, post: state.post });

const mapDispatchToProps = (dispatch) => bindActionCreators({ getPosts, likePost, unlikePost }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Home);

