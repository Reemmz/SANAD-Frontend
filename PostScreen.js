import React from 'react';
import {
  StyleSheet,
  Button,
  View,
  Alert, TouchableHighlight, AsyncStorage, ScrollView, Image, TextInput, ActivityIndicator
} from 'react-native';
import Constants from 'expo-constants';
import axios from 'axios';
import { Icon } from 'react-native-elements'
import { Video } from 'expo-av';
import Constants2 from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { Block, Text, theme } from "galio-framework";
import { ListItem } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import { Platform } from '@unimodules/core';

class PostScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      postId: 0,
      post: {},
      image: null,
      loading: false,
      showProgressBtn: true
    }

  }


  getPermissionAsync = async () => {
    if (Constants2.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  }


  pickDocument = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [4, 3],
    });

    console.log('result', result);
    if (!result.cancelled) {
      this.setState({
        image: result,
      });

      this.postDocument();
    }
  }



  async markAsCompleted() {
    console.log('clciked');

    let ACCESS_TOKEN = await AsyncStorage.getItem('ACCESS_TOKEN');
    ACCESS_TOKEN = ACCESS_TOKEN.replace('"', '');
    const AuthStr = `Bearer ${ACCESS_TOKEN}`;


    axios({
      method: 'POST',
      responseType: 'json',
      url: `http://165.22.218.109/api/mark-as-completed`,
      data: {
        post_id: this.state.post.id,
        folder_id: this.state.post.folder_id,
      }, headers: { Authorization: AuthStr }
    })
      .then(response => {
        this.setState({ showProgressBtn: false });
        Alert.alert('تم حفظ البيانات بنجاح.');
      })
      .catch(err => {
        if (err.response.data.errors) {
          Alert.alert(err.response.data.message);
        }
      });
  }



  async postDocument() {

    this.setState({ loading: true });
    // console.log("VIDEO: " + JSON.stringify(this.state.image));
    const { uri } = this.state.image;


    let ACCESS_TOKEN = await AsyncStorage.getItem('ACCESS_TOKEN');
    ACCESS_TOKEN = ACCESS_TOKEN.replace('"', '');
    const AuthStr = `Bearer ${ACCESS_TOKEN}`;

    const data = new FormData()

    data.append('video',
      { uri: this.state.image.uri, name: 'vid.mov', type: 'video/quicktime' });

    console.log(data);


    let settings = { headers: { 'content-type': 'multipart/form-data' } }
    axios.post('http://165.22.218.109/api/upload', data, settings)
      .then(response => {
        console.log(response.data);
        this.setState({ loading: false });
      })
      .catch(err => {
        console.log((err.response.data));
      });



  }

  componentDidMount() {
    this.isCompleted();
  }
  componentWillMount() {
    const { navigation } = this.props;
    const postId = JSON.stringify(navigation.getParam('postId', 0));
    this.setState({ postId: postId });
    this.featchPost();
    this.getPermissionAsync();


  }


  async featchPost() {
    let ACCESS_TOKEN = await AsyncStorage.getItem('ACCESS_TOKEN');
    ACCESS_TOKEN = ACCESS_TOKEN.replace('"', '');
    const AuthStr = `Bearer ${ACCESS_TOKEN}`;
    axios.get(`http://165.22.218.109/api/post/${this.state.postId}`, { headers: { Authorization: AuthStr } })
      .then(response => {
        this.setState({ post: response.data.post });
      })
      .catch((error) => {
        Alert.alert(error);
      });
  }


  async isCompleted() {

    let ACCESS_TOKEN = await AsyncStorage.getItem('ACCESS_TOKEN');
    ACCESS_TOKEN = ACCESS_TOKEN.replace('"', '');
    const AuthStr = `Bearer ${ACCESS_TOKEN}`;
    axios.get(`http://165.22.218.109/api/is-completed/${this.state.postId}`, { headers: { Authorization: AuthStr } })
      .then(response => {
        console.log(response.data);
        if (response.data == true) {
          this.setState({ showProgressBtn: false });

        }

      })
      .catch((error) => {
        Alert.alert(error);
      });
  }


  async handleDelete() {
    let ACCESS_TOKEN = await AsyncStorage.getItem('ACCESS_TOKEN');
    ACCESS_TOKEN = ACCESS_TOKEN.replace('"', '');
    const AuthStr = `Bearer ${ACCESS_TOKEN}`;
    axios({
      method: 'POST',
      responseType: 'json',
      url: `http://165.22.218.109/api/remove-folder/${this.state.folder.id}`,
      data: {
      }, headers: { Authorization: AuthStr }
    })
      .then(response => {
        const data = response.data;
        if (data.success == true) {
          this.props.navigation.navigate('FoldersList');
        }
      })
      .catch(err => {
        if (err.response.data.errors.name) {
          Alert.alert(err.response.data.errors.username);
        }
      });
  }



  render() {

    let url = `http://165.22.218.109/storage/${this.state.post.exc_vid_url}`;
    console.log(url);

    return (
      <ScrollView>
        <TouchableHighlight underlayColor="white" onPress={() => console.log('clicked')}>
          <Block style={styles.box}>
            <Block middle>
              <Text bold size={20} style={styles.text}> معلومات التمرين   </Text>
            </Block>
            <Separator />
            <Block middle style={{ width: 310, marginTop: 20 }}>


              <Text bold size={15} color="#32325D" style={{ width: 300, marginBottom: 20, textAlign: "right" }}>

                العنوان: {this.state.post.exc_title}
              </Text>

              <Text bold size={15} color="#32325D" style={{ width: 300, marginBottom: 20, textAlign: "right" }}>
                النوع: {this.state.post.exc_type}
              </Text>

              <Text bold size={15} color="#32325D" style={{ width: 300, marginBottom: 20, textAlign: "right" }}>
                المدة بالدقائق: {this.state.post.duration_in_mins}
              </Text>

              <Text bold size={18} color="#32325D" style={{ width: 300, marginBottom: 20, textAlign: "right" }}>
                التكرار : {this.state.post.exc_rep}
              </Text>


              {this.state.loading &&
                <View style={[styles.container, styles.horizontal]}>
                  <ActivityIndicator size="large" color="#OOO" />
                </View>
              }





              {this.state.post.exc_vid_url &&
                <Video
                  source={{ uri: url }}
                  volume={1.0}
                  isMuted={false}
                  resizeMode="cover"
                  shouldPlay
                  isLooping
                  ref={(ref) => {
                    this.player = ref
                  }}
                  style={{ width: 340, height: 300 }}
                />
              }



              <Text bold size={10} color="#32325D" style={{ width: 300, marginTop: 20, marginBottom: 10, textAlign: "right" }}>
                {this.state.post.vid_desc}
              </Text>

              <View style={styles.fixToText}>

                {this.state.showProgressBtn &&
                  <TouchableHighlight style={[styles.btn2]}
                    onPress={this.markAsCompleted.bind(this)}
                  >
                    <View style={styles.fixToText}>
                      <Text bold style={{ color: "#000" }}>  إكمال التمرين </Text>
                      <Icon style={styles.icon_2} size="18" name='check-circle' type='font-awesome' />
                    </View>
                  </TouchableHighlight>
                }


              </View>
            </Block>
          </Block>
        </TouchableHighlight>
      </ScrollView>
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
    justifyContent: "space-between",
  }
  ,
  text: {
    color: "#333",
  },
  icon: {
    paddingLeft: 8,
    color: "#FFF",
  },
  icon_2: {
    paddingLeft: 8,
    color: "green",
  },
  separator: {
    marginVertical: 6,
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
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: "#333",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 4,
    shadowOpacity: 0.2,
    padding: 15,
    paddingRight: 20,
    textAlign: "right",
    marginTop: 30
  },
  btn: {
    textAlign: "center",
    fontSize: 20,
    width: 90,
    height: 37,
    borderRadius: 10,
    shadowColor: "#333",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 4,
    shadowOpacity: 0.2,
    backgroundColor: "#FF4DFF",
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 30,
    marginTop: 20,

  },

  btn2: {
    textAlign: "center",
    fontSize: 20,
    width: 150,
    height: 37,
    borderRadius: 10,
    shadowColor: "#333",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 4,
    shadowOpacity: 0.2,
    backgroundColor: "#FFF",
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 30,
    marginTop: 80,
    color: "#000",
    marginBottom: 15

  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  list: {
    width: 300,
    marginBottom: 20

  }
});

function Separator() {
  return <View style={styles.separator} style={{ width: 300, borderBottomWidth: StyleSheet.hairlineWidth, marginVertical: 8, borderBottomColor: '#737373' }} />;
}
export default PostScreen;