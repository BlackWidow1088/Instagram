import React from 'react';
import { View, Text, TextInput, FlatList, KeyboardAvoidingView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'

import { addMessage, getMessages } from '../store/actions/message';
import appStyle from '../styles/app';

class Chat extends React.Component {
  state = {
    message: '',
  }

  componentDidMount = () => {
    this.props.getMessages()
  }

  sendMessage = () => {
    const { params } = this.props.navigation.state
    this.props.addMessage(params, this.state.message)
    this.setState({ message: '' })
  }

  render() {
    const { params } = this.props.navigation.state
    const { uid } = this.props.user
    if (!this.props.messages) return <ActivityIndicator style={appStyle.container} />
    return (
      <KeyboardAvoidingView enabled behavior='padding' style={appStyle.container}>
        <FlatList
          inverted
          keyExtractor={(item) => JSON.stringify(item.date)}
          data={this.props.messages.filter(message => message.members.indexOf(params) >= 0 && message.members.indexOf(this.props.user.uid) >= 0)}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => this.goToChat(item)} style={[appStyle.row, appStyle.space]}>
              {item.uid !== uid ? <Image style={appStyle.roundImage} source={{ uri: item.photo }} /> : null}
              <View style={[appStyle.container, item.uid === uid ? appStyle.right : appStyle.left]}>
                <Text style={appStyle.bold}>{item.username}</Text>
                <Text style={appStyle.gray}>{item.message}</Text>
                <Text style={[appStyle.gray, appStyle.small]}>{moment(item.date).format('ll')}</Text>
              </View>
              {item.uid === uid ? <Image style={appStyle.roundImage} source={{ uri: item.photo }} /> : null}
            </TouchableOpacity>
          )} />
        <TextInput
          style={appStyle.input}
          onChangeText={(message) => this.setState({ message })}
          value={this.state.message}
          returnKeyType='send'
          placeholder='Send Message'
          onSubmitEditing={this.sendMessage} />
      </KeyboardAvoidingView>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ addMessage, getMessages }, dispatch)
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    messages: state.messages
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat)