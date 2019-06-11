import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Text, View, TextInput, FlatList, Image, KeyboardAvoidingView } from 'react-native';

import moment from 'moment'

import appStyle from '../styles/app';
import { addComment, getComments } from '../store/actions/post';

class Comment extends React.Component {
  state = {
    comment: ''
  }

  componentDidMount = () => {
    const { params } = this.props.navigation.state
    this.props.getComments(params)
  }

  postComment = () => {
    const { params } = this.props.navigation.state
    this.props.addComment(this.state.comment, params)
    this.setState({ comment: '' })
  }

  render() {
    return (
      <KeyboardAvoidingView enabled behavior='padding' style={appStyle.container}>
        <FlatList
          onRefresh={this.componentDidMount}
          refreshing={false}
          keyExtractor={(item) => JSON.stringify(item.date)}
          data={this.props.post.comments}
          renderItem={({ item }) => (
            <View style={[appStyle.row, appStyle.space]}>
              <Image style={appStyle.roundImage} source={{ uri: item.commenterPhoto }} />
              <View style={[appStyle.container, appStyle.left]}>
                <Text style={appStyle.bold}>{item.commenterName}</Text>
                <Text style={appStyle.gray}>{item.comment}</Text>
                <Text style={[appStyle.gray, appStyle.small]}>{moment(item.date).format('ll')}</Text>
              </View>
            </View>
          )} />
        <TextInput
          style={appStyle.input}
          onChangeText={(comment) => this.setState({ comment })}
          value={this.state.comment}
          returnKeyType='send'
          placeholder='Add Comment'
          onSubmitEditing={this.postComment} />
      </KeyboardAvoidingView>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ addComment, getComments }, dispatch)
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    post: state.post
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Comment)