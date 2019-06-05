import React from 'react';
import { Text, View, TextInput, TouchableOpacity, Image, FlatList, Modal, SafeAreaView, } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Location, Permissions, IntentLauncherAndroid } from 'expo';

import appStyle from '../styles/app.js';
import { updateDescription, uploadPost, updateLocation } from '../store/actions/post';
import { ENV } from '../env';
const GOOGLE_API = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json'

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
    try {
      this.setState({ showModal: true })
      const permission = await Permissions.askAsync(Permissions.LOCATION)
      if (permission.status === 'granted') {
        if (!await Location.hasServicesEnabledAsync()) {
          await IntentLauncherAndroid.startActivityAsync(
            IntentLauncherAndroid.ACTION_LOCATION_SOURCE_SETTINGS
          );
        }
        const location = await Location.getCurrentPositionAsync()
        const url = `${GOOGLE_API}?location=${location.coords.latitude},${location.coords.longitude}&rankby=distance&key=${ENV.googleApiKey}`
        const response = await fetch(url)
        const data = await response.json()
        this.setState({ locations: data.results })
      }
    } catch (error) {
      console.log('error in post ', error);
    }
  }
  render() {
    return (
      <View style={appStyle.container}>
        <Modal animationType='slide' transparent={false} visible={this.state.showModal}>
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
        <Image style={appStyle.postPhoto} source={{ uri: this.props.post.photo }} />
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

const mapDispatchToProps = (dispatch) => bindActionCreators({ updateDescription, uploadPost, updateLocation }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Post);

