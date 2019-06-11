import React from 'react';
import { Text, View, TextInput, TouchableOpacity, Image, FlatList, Modal, SafeAreaView } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import appStyle from '../styles/app.js';
import { updatePostPhoto, updateDescription, uploadPost, updateLocation } from '../store/actions/post';
import { uploadPhoto } from '../store/actions';
import MobileService from '../services/mobile-service';

class Post extends React.Component {
  state = {
    showModal: false,
    locations: []
  }

  post = () => {
    this.props.uploadPost()
    this.props.navigation.navigate('Home')
  }

  setLocation = (location) => {
    const place = {
      name: location.name,
      coords: {
        lat: location.geometry.location.lat,
        lng: location.geometry.location.lng
      }
    }
    this.setState({ showModal: false })
    this.props.updateLocation(place)
  }

  getLocations = async () => {
    // show loader
    const locationData = await MobileService.getLocations();
    // hide loader
    this.setState({ showModal: locationData ? true : false, locations: locationData });
  }
  onWillFocus = async () => {
    if (!this.props.post.postPhoto) {
      const image = await MobileService.openLibrary();
      if (image) {
        const url = await this.props.uploadPhoto(image)
        this.props.updatePostPhoto(url)
      }
    }
  }
  render() {
    return (
      <View style={appStyle.container}>
        <NavigationEvents onWillFocus={this.onWillFocus} />
        <Modal animationType='slide' transparent={false} visible={this.state.showModal}
          onRequestClose={() => this.setState({ showModal: false })}>
          <SafeAreaView style={[appStyle.container, appStyle.center]}>
            <FlatList
              keyExtractor={(item) => item.id}
              data={this.state.locations}
              renderItem={({ item }) => (
                <TouchableOpacity style={appStyle.border} onPress={() => this.setLocation(item)}>
                  <Text style={appStyle.gray}>{item.name}</Text>
                  <Text style={appStyle.gray}>{item.vicinity}</Text>
                </TouchableOpacity>
              )} />
          </SafeAreaView>
        </Modal>
        <Image style={appStyle.postPhoto} source={{ uri: this.props.post.postPhoto }} />
        <TextInput
          style={appStyle.border}
          value={this.props.post.description}
          onChangeText={text => this.props.updateDescription(text)}
          placeholder='Description'
        />
        <TouchableOpacity style={appStyle.border} onPress={this.getLocations}>
          <Text style={appStyle.gray}>{this.props.post.location ? this.props.post.location.name : 'Add a Location'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={appStyle.button} onPress={this.post}>
          <Text>Post</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  post: state.post
});

const mapDispatchToProps = (dispatch) => bindActionCreators({ uploadPhoto, updatePostPhoto, updateDescription, uploadPost, updateLocation }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Post);

