
import React from 'react';
import {
  StyleSheet,
  View,
  Alert, TouchableHighlight, AsyncStorage, ScrollView, TextInput
} from 'react-native';
import Constants from 'expo-constants';
import axios from 'axios';
import { GiftedChat } from 'react-native-gifted-chat'


// import { Icon } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';
import { Block, Text, theme } from "galio-framework";
import firebase from 'firebase';

class ChatScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: '',
      from_user: 0,
      to_user: 0,
      messages: [

      ]
    }
  }

  componentDidMount() {
    //  this.loadChat()

  }

  loadChat() {
    let messages = [];
    firebase.database().ref('/messages').on('value', (snapshot) => {
      snapshot.forEach(function (message) {
        var itemVal = message.val();
        messages.push(itemVal);
      });
      console.log(messages);
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }))
    })
  }//end of the loadChat
  onSend() {
    this.sendMSG(this.state.message)
  }
  componentWillMount() {

    var firebaseConfig = {
      apiKey: "AIzaSyB7mjtCpIQRkA-3nLPKNHQZ4gehJl8QeCs",
      authDomain: "sanad-74ea1.firebaseapp.com",
      databaseURL: "https://sanad-74ea1.firebaseio.com",
      projectId: "sanad-74ea1",
      storageBucket: "sanad-74ea1.appspot.com",
      messagingSenderId: "536187047763",
      appId: "1:536187047763:web:eeda489f69ce8e60e71ba6",
      measurementId: "G-1WWNG6DJ68"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    // firebase.analytics();
  }



  sendMSG() {

    const message = 'Hello';
    from_user = Math.ceil(Math.random() * 100);
    to_user = Math.ceil(Math.random() * 100);;

    firebase.database().ref('messages/' + to_user).set({
      _id: 1,
      avatar: "https://placeimg.com/140/140/any",
      text: message,
      from: from_user,
      to: to_user,
      read: false, //by default the message is NOT read yet
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'Naif Alshehri',
        avatar: 'https://placeimg.com/140/140/any',
      },
    }).then(() => {

      console.log('inserted');


    }).catch((err) => {
      console.log(err);

    });
  }

  sendMessage = (type, content, isInverted) => {
    console.log(type, content, isInverted, 'msg')
  }

  render() {
    return (

      <GiftedChat
      messages={this.state.messages}
    />

    );

  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
    marginHorizontal: 16,
  },

  box: {
    // position:"absolute",
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: 30,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 2,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    // backgroundColor:"#f1f1f1"
  }
  ,
  text: {
    padding: 20,
    color: "#333",
  },
  icon: {
    size: 30,
    color: "#333",
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  input: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderBottomWidth: 1,
    width: 300,
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: "#333",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 4,
    shadowOpacity: 0.2,
    padding: 15,
    paddingRight: 20,
    textAlign: "right",
    marginTop: 20
  },
  btn: {
    textAlign: "center",
    fontSize: 20,
    width: 150,
    height: 45,
    borderRadius: 20,
    shadowColor: "#333",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 4,
    shadowOpacity: 0.2,
    padding: 15,
    backgroundColor: "#FF4DFF",
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 25,

  }
});

function Separator() {
  return <View style={styles.separator} style={{ width: 300, borderBottomWidth: StyleSheet.hairlineWidth, marginVertical: 8, borderBottomColor: '#737373' }} />;
}
export default ChatScreen;