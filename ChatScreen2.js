import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat'; // 0.3.0

import Fire from './Fire';
import {
  AsyncStorage,
} from 'react-native';

Props = {
  name: "",
};

class ChatScreen2 extends React.Component {

  constructor() {
    super(Props)

    this.state = {

      user_id: 0,
      user_full_name: "",

    }
  }
  static navigationOptions = ({ navigation }) => ({
    title: (navigation.state.params || {}).name || 'Chat!',
  });




  async componentDidMount() {

    USER_ID = await AsyncStorage.getItem('USER_ID');
    USER_FULL_NAME = await AsyncStorage.getItem('USER_FULL_NAME');

    this.setState({ user_id: USER_ID });
    this.setState({ user_full_name: USER_FULL_NAME });

    Fire.shared.on(message =>
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),
      }))
    );
  }
  componentWillUnmount() {
    Fire.shared.off();
  }

  state = {
    messages: [],
  };

  get user() {

    console.log(this.state.user_id);
    console.log(this.state.user_full_name);

    return {
      name: this.state.user_id,
      _id: this.state.user_full_name,
    };
  }

  render() {
    return (


      <GiftedChat title="المحادثات"
        messages={this.state.messages}
        onSend={Fire.shared.send}
        user={this.user}
        alwaysShowSend={true}
      />

    );
  }


}

export default ChatScreen2;