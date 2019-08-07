import React from 'react';
import {
  Text,
  View,
  Image
} from 'react-native';

// import MapView, { Marker } from 'react-native-maps';
import { MapView } from 'expo';
import appStyle from '../styles/app';
import mapStyle from '../styles/map';

class Map extends React.Component {
  state = {
    markers: []
  }
  handlePress = (e) => {
    this.setState({
      markers: [
        ...this.state.markers,
        {
          coordinate: e.nativeEvent.coordinate,
          cost: `$${this.getRandomInt(50, 300)}`
        }
      ]
    })
  }
  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }
  render() {
    const { location } = this.props.navigation.state.params
    return (
      <MapView
        style={appStyle.container}
        initialRegion={{
          latitude: location.coords.lat,
          longitude: location.coords.lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={this.handlePress}>
        <MapView.Marker
          coordinate={{
            latitude: location.coords.lat,
            longitude: location.coords.lng
          }}
          title={location.name}
        /> 
        {this.state.markers.map((marker) => {
          return (
            <MapView.Marker {...marker} >
              {/* <View style={mapStyle.marker}>
                <Text style={mapStyle.text}>{marker.cost}</Text>
              </View> */}
                <Image style={mapStyle.squareImage} source={require('../assets/mock/images/waterfall/1.jpg')}></Image>
            </MapView.Marker>
          )
        })}
      </MapView>
    );
  }
}

export default Map;


