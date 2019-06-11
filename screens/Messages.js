import React from 'react';
import { View, FlatList, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'

import moment from 'moment'
import { groupBy, values } from 'lodash'

import { getMessages } from '../store/actions/message'
import appStyle from '../styles/app'


class Messages extends React.Component {

  componentDidMount = () => {
    this.props.getMessages()
  }

  goToChat = (members) => {
    const uid = members.filter(id => id !== this.props.user.uid)
    this.props.navigation.navigate('Chat', uid[0])
  }

  render() {
    if (!this.props.messages) return <ActivityIndicator style={appStyle.container} />
    return (
      <View style={appStyle.container}>
        <FlatList
          keyExtractor={(item) => JSON.stringify(item[0].date)}
          data={values(groupBy(this.props.messages, 'members'))}
          renderItem={({ item, index }) => (
            <TouchableOpacity onPress={() => this.goToChat(item[0].members)} style={[appStyle.row, appStyle.space]}>
              <Image style={appStyle.roundImage} source={{ uri: item[0].photo }} />
              <View style={[appStyle.container, appStyle.left]}>
                <Text style={appStyle.bold}>{item[0].username}</Text>
                <Text style={appStyle.gray}>{item[0].message}</Text>
                <Text style={[appStyle.gray, appStyle.small]}>{moment(item[0].date).format('ll')}</Text>
              </View>
            </TouchableOpacity>
          )} />
      </View>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ getMessages }, dispatch)
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    messages: state.messages,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Messages);