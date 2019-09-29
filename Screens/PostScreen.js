
import React, { useState, Component } from 'react';
import { StyleSheet, Text, SafeAreaView, ScrollView, Button } from 'react-native';
import { AsyncStorage } from 'react-native';


export default class PostScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      access_token: "",
    }
    this.getToken();
  }
  async getToken() {
    try {
      const token = await AsyncStorage.getItem('ACCESS_TOKEN');
      this.setState({ access_token: token })
    } catch (err) {
      console.log('error during getting token: ', err);
    }
  }

  async handleLogout() {
    await AsyncStorage.removeItem('ACCESS_TOKEN');
    this.props.navigation.navigate('Login');

  }

  render() {


   

    return (

      <SafeAreaView style={styles.container}>
        <Button
          title="Log out"
          onPress={this.handleLogout.bind(this)}
        />
        <ScrollView style={styles.scrollView}>
          <Text style={styles.text}>



            POST SCREEN  |  :
             Access Token is :  {this.state.access_token}
          </Text>
        </ScrollView>          
        </SafeAreaView>

    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 70
  },
  scrollView: {
    backgroundColor: 'white',
    marginHorizontal: 20,
  },
  text: {
    fontSize: 10,
  },
});
