import React from 'react';
import { connect } from 'react-redux'
import { Text, View, FlatList, ActivityIndicator, Image } from 'react-native';

import orderBy from 'lodash/orderBy'
import moment from 'moment'

import firebase from '../config/firebase';
import appStyle from '../styles/app';


class Activity extends React.Component {
  state = {
    activity: []
  }

  componentDidMount = () => {
    this.getActivity()
  }

  getActivity = async () => {
    let activity = []
    const query = await firebase.firestore().collection('activity').where('uid', '==', this.props.user.uid).get()
    query.forEach((response) => {
      activity.push(response.data())
    })
    this.setState({ activity: orderBy(activity, 'date', 'desc') })
  }

  renderList = (item) => {
    switch (item.type) {
      case 'LIKE':
        return (
          <View style={[appStyle.row, appStyle.space]}>
            <Image style={appStyle.roundImage} source={{ uri: item.likerPhoto }} />
            <View style={[appStyle.container, appStyle.left]}>
              <Text style={appStyle.bold}>{item.likerName}</Text>
              <Text style={appStyle.gray}>Liked Your Photo</Text>
              <Text style={[appStyle.gray, appStyle.small]}>{moment(item.date).format('ll')}</Text>
            </View>
            <Image style={appStyle.roundImage} source={{ uri: item.postPhoto }} />
          </View>
        )
      case 'COMMENT':
        return (
          <View style={[appStyle.row, appStyle.space]}>
            <Image style={appStyle.roundImage} source={{ uri: item.commenterPhoto }} />
            <View style={[appStyle.container, appStyle.left]}>
              <Text style={appStyle.bold}>{item.commenterName}</Text>
              <Text style={appStyle.gray}>{item.comment}</Text>
              <Text style={[appStyle.gray, appStyle.small]}>{moment(item.date).format('ll')}</Text>
            </View>
            <Image style={appStyle.roundImage} source={{ uri: item.postPhoto }} />
          </View>
        )
      default: null
    }
  }

  render() {
    if (this.state.activity.length <= 0) return <ActivityIndicator style={appStyle.container} />
    return (
      <View style={appStyle.container}>
        <FlatList
          onRefresh={() => this.getActivity()}
          refreshing={false}
          data={this.state.activity}
          keyExtractor={(item) => JSON.stringify(item.date)}
          renderItem={({ item }) => this.renderList(item)} />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps)(Activity)