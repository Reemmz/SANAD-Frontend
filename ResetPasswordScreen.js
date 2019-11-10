import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, TextInput, AsyncStorage } from 'react-native';
import { Block, Errors } from "galio-framework";

import {
  ImageBackground,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView
} from 'react-native';
import { Icon } from "../components";
import { Images, argonTheme } from "../constants";
import axios from 'axios';

const { width, height } = Dimensions.get("screen");

export default class RegisterScreen extends Component {


  constructor(props) {

    super(props);


    this.state = {
      email: ""
    }
  }


  async onPasswordResetPressed() {
    const {email} = this.state;
    if ( email == "" ) {
      alert('جميع الحقول مطلوبة');
      return;
    }
    axios({
      method: 'POST',
      responseType: 'json',
      url: `http://127.0.0.1:8000/password/reset`,
      data: {
        email: this.state.email,
      }
    })
      .then(response => {
        const data = response.data;
        if (data.success == true) {
          this.storeToken(data.token_data.access_token);
          this.props.navigation.navigate('Post');
        }

      })
      .catch(err => {
        if (err.response.data.errors.email) {
          alert(err.response.data.errors.email);
          return;
        }
        return;
      });

  }



  render() {
    return (

      <View style={styles.container}>
        <Block flex middle>
          <StatusBar hidden />
          <ImageBackground
            source={Images.RegisterBackground}
            style={{ width, height, zIndex: 1 }}>
            <Block flex middle>
              <Block style={styles.registerContainer}>
                <Block flex={0.25} middle style={styles.socialConnect}>
                  <Text size={20}>استرجاع كلمة المرور </Text>

                </Block>
                <Block flex>
                  <Block flex={0.17} middle>

                  </Block>
                  <Block flex center>
                    <KeyboardAvoidingView
                      style={{ flex: 1 }}
                      behavior="padding"
                      enabled>

                      <Block width={width * 0.8} style={{ marginBottom: 15 }}>


                      <View style={styles.inputContainer}>
          <Image style={styles.inputIcon} source={{uri: 'https://img.icons8.com/ultraviolet/40/000000/email.png'}}/>
          <TextInput style={styles.inputs}
              placeholder="البريد الإلكتروني"
              keyboardType="email-address"
              underlineColorAndroid='transparent'
              onChangeText={(email) => this.setState({email})}/>
        </View>

                      </Block>


                      <Block width={width * 0.8}>




                      </Block>

                      <Block middle>
                        <Button title="إرسال" color="primary" style={styles.createButton}
                          onPress={this.onPasswordResetPressed.bind(this)}
                        />
                        <Button
                          title="    "
                          onPress={() => this.props.navigation.navigate('Login')}
                        />

                      </Block>
                    </KeyboardAvoidingView>
                  </Block>
                </Block>
              </Block>
            </Block>
          </ImageBackground>
        </Block>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00b5ec',
  },
  inputContainer: {
      borderBottomColor: '#F5FCFF',
      backgroundColor: '#FFFFFF',
      borderRadius:30,
      borderBottomWidth: 1,
      width:250,
      height:45,
      marginBottom:20,
      flexDirection: 'row',
      alignItems:'center'
  },
  inputs:{
      height:45,
      marginLeft:16,
      borderBottomColor: '#FFFFFF',
      flex:1,
  },
  inputIcon:{
    width:30,
    height:30,
    marginLeft:15,
    justifyContent: 'center'
  },
  buttonContainer: {
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:250,
    borderRadius:30,
  },
  signupButton: {
    backgroundColor: "#FF4DFF",
  },
  signUpText: {
    color: 'white',
  }
,
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 50,
    paddingTop: 20
  },
  input: {
    height: 20,
    marginTop: 0,
    padding: 4,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#48bbec'
  },
  button: {
    height: 50,
    backgroundColor: '#48BBEC',
    alignSelf: 'stretch',
    marginTop: 10,
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 22,
    color: '#FFF',
    alignSelf: 'center'
  },
  heading: {
    fontSize: 30,
  },
  error: {
    color: 'red',
    paddingTop: 10
  },
  success: {
    color: 'green',
    paddingTop: 10
  },
  loader: {
    marginTop: 20
  }

  , registerContainer: {
    width: width * 0.9,
    height: height * 0.78,
    backgroundColor: "#F4F5F7",
    borderRadius: 4,
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
    overflow: "hidden"
  },
  socialConnect: {
    backgroundColor: argonTheme.COLORS.WHITE,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#8898AA"
  },
  socialButtons: {
    width: 120,
    height: 40,
    backgroundColor: "#fff",
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1
  },
  socialTextButtons: {
    color: argonTheme.COLORS.PRIMARY,
    fontWeight: "800",
    fontSize: 14
  },
  inputIcons: {
    marginRight: 12
  },
  passwordCheck: {
    paddingLeft: 15,
    paddingTop: 13,
    paddingBottom: 30
  },
  createButton: {
    width: width * 0.5,
    marginTop: 25
  } 
});
 