import React from 'react';
import { Text, View, Image, FlatList, TouchableOpacity } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import appStyle from '../styles/app.js';
import { getPosts } from '../store/actions/post';

class Home extends React.Component {
  componentDidMount = () => {
    // call loader till the images are getting loaded
    //  or show cached images for the user
    this.props.getPosts();
  }
  navigateMap = (item) => {
    console.log(this.props.navigation)
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
          data={this.props.post.feed}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View>
              <View style={[appStyle.row, appStyle.center]}>
                <View style={[appStyle.row, appStyle.center]}>
                  <Image style={appStyle.roundImage} source={{ uri: item.photo }} />
                  <View>
                    <Text>{item.username}</Text>
                    <TouchableOpacity onPress={() => this.navigateMap(item)} >
                      <Text>{item.location ? item.location.name : null}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <Ionicons style={{ margin: 5 }} name='ios-flag' size={25} />
              </View>
              <Image style={appStyle.postPhoto} source={{ uri: item.postPhoto }} />
              <View style={appStyle.row}>
                <Ionicons style={{ margin: 5 }} name='ios-heart-empty' size={25} />
                <Ionicons style={{ margin: 5 }} name='ios-chatbubbles' size={25} />
                <Ionicons style={{ margin: 5 }} name='ios-send' size={25} />
              </View>
              <Text>{item.description}</Text>
            </View>
          )}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({ post: state.post });

const mapDispatchToProps = (dispatch) => bindActionCreators({ getPosts }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Home);

