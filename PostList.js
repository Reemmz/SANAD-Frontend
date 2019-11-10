import React, { useState, Component } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';

export default class PostList extends Component {
  static navigationOptions = {
    title: 'PostList',
  };
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View>


        <Text>Post List  Screen</Text>
        <Button
          title="Post Details"
          onPress={() => navigate('Post')}
        />


      </View>

    );
  }
}