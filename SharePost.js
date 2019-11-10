import React from "react";

import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  Text,
  View,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  TouchableHighlight, AsyncStorage, ActivityIndicator
} from "react-native";
import { Block, theme } from "galio-framework";
import axios from 'axios';
import { Icon } from 'react-native-elements'
import Constants2 from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';

import { Button, Input } from "../components";
import { Images, argonTheme } from "../constants";
import RNPickerSelect from 'react-native-picker-select';
import { TextInput } from "react-native-gesture-handler";
import { Alert } from "react-native";


const { width, height } = Dimensions.get("screen");

class SharePost extends React.Component {


  constructor(props) {
    super(props);

    this.state = {
      exc_title: "",
      exc_type: "تمارين تقوية ",
      vid_desc: "",
      duration_in_mins: "",
      exc_rep: "",
      folder_id: "",
      folders: [],
      image: null,
      loading: false
    }
  }

  async featchFolders() {
    let ACCESS_TOKEN = await AsyncStorage.getItem('ACCESS_TOKEN');
    ACCESS_TOKEN = ACCESS_TOKEN.replace('"', '');
    const AuthStr = `Bearer ${ACCESS_TOKEN}`;
    axios.get('http://165.22.218.109/api/get-folders', { headers: { Authorization: AuthStr } })
      .then(response => {
        this.setState({ folders: response.data.folders });
      })
      .catch((error) => {
        Alert.alert(error);
      });
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

    }
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




  componentWillMount() {
    this.featchFolders();
    this.getPermissionAsync();
  }

  async addPost() {
    if (this.state.image == null) {
      alert('الرجاء اختيار فيديو');
      return;
    }

    const { exc_title, exc_type, vid_desc, duration_in_mins, exc_rep, folder_id } = this.state;
    if (exc_title == "" || exc_type == "" || vid_desc == "" || duration_in_mins == "" || exc_rep == "" || folder_id == "") {
      Alert.alert('جميع الحقول مطلوبة');
      return;

    }
    let ACCESS_TOKEN = await AsyncStorage.getItem('ACCESS_TOKEN');

    ACCESS_TOKEN = ACCESS_TOKEN.replace('"', '');
    // console.log("TOKEN: " + ACCESS_TOKEN);
    const AuthStr = `Bearer ${ACCESS_TOKEN}`;


    const data = new FormData();
    data.append('exc_title', this.state.exc_title);
    data.append('exc_type', this.state.exc_type);
    data.append('exc_vid_url', this.state.exc_vid_url);
    data.append('vid_desc', this.state.vid_desc);
    data.append('duration_in_mins', this.state.duration_in_mins);
    data.append('exc_rep', this.state.exc_rep);
    data.append('folder_id', this.state.folder_id);

    data.append('video',
      { uri: this.state.image.uri, name: 'vid.mov', type: 'video/quicktime' });
    console.log(data);
    this.setState({ loading: true });


    let settings = { headers: { 'content-type': 'multipart/form-data', 'Accept': 'application/json', 'Authorization': `${AuthStr}` } }
    axios.post('http://165.22.218.109/api/post', data, settings)
      .then(response => {
        console.log(response.data);
        this.setState({ loading: false });

        const data = response.data;
        if (data.success == true) {
          this.props.navigation.navigate('Post', {
            postId: data.post.id
          });
        }
      })
      .catch(err => {

        if (err.response.data.errors.exc_title) {
          alert(err.response.data.errors.exc_title);
          return;
        }
        if (err.response.data.errors.exc_type) {
          alert(err.response.data.errors.exc_type);
          return;
        }
        if (err.response.data.errors.exc_vid_url) {
          alert(err.response.data.errors.exc_vid_url);
          return;
        }
        if (err.response.data.errors.vid_desc) {
          alert(err.response.data.errors.vid_desc);
          return;
        }
        if (err.response.data.errors.duration_in_mins) {
          alert(err.response.data.errors.duration_in_mins);
          return;
        }

        if (err.response.data.errors.exc_rep) {
          alert(err.response.data.errors.exc_rep);
          return;
        }
        Alert.alert(err.response.data.message);
        return;
      });
  }









  render() {
    return (
      <Block flex >
        <StatusBar hidden />
        <ImageBackground
          source={Images.RegisterBackground}
          style={{ width, height, zIndex: 1 }} >
          <Block flex middle>
            <Block style={styles.registerContainer}>
              <Block middle style={styles.socialConnect}>
                <Text bold style={styles.baseText1}>
                  إضافة تمرين جديد
                </Text>
              </Block>
              <ScrollView>
                <KeyboardAvoidingView
                  style={{ flex: 1 }}
                  behavior="padding"
                  enabled  >


                  <Block middle>
                    <View style={styles.inputContainer}>
                      <Icon size="18" name='edit' color="#666" type='font-awesome' />
                      <TextInput style={styles.inputs}
                        placeholder="اسم التمرين"
                        onChangeText={(exc_title) => this.setState({ exc_title })} />
                    </View>
                  </Block>
                  <Block middle>
                    <View style={styles.list} >
                      <Icon size="18" name='folder' color="#666" type='font-awesome' />
                      <RNPickerSelect
                        doneText="تم"
                        onValueChange={(folder_id) => this.setState({ folder_id })}
                        placeholder={{ label: " الجلسة " }}
                        placeholderTextColor="#000"
                        items={this.state.folders.map(folder =>
                          ({
                            label: folder.name,
                            value: folder.id,
                          })
                        )}
                      />

                    </View>

                  </Block>

                  <Block middle>
                    <View style={styles.list} >
                      <Icon size="18" name='child' color="#666" type='font-awesome' />
                      <RNPickerSelect
                        doneText="تم"
                        onValueChange={(exc_type) => this.setState({ exc_type })}
                        placeholder={{ label: "اختر نوع التمرين" }}
                        placeholderTextColor="#000"
                        items={[
                          { label: 'تمارين تقوية', value: 'تمارين تقوية' },
                          { label: 'تمارين استطالة', value: 'تمارين استطالة' },
                          { label: 'تمارين توازن', value: 'تمارين توازن' },
                          { label: 'تمارين وظيفية', value: 'تمارين وظيفية' },
                          { label: 'تمارين للمحافظة على مدى الحركة', value: 'تمارين للمحافظة على مدى الحركة' },
                          { label: 'تمارين الشد العلاجي ', value: 'تمارين الشد العلاجي' },
                          { label: 'تمارين الحركية', value: 'تمارين الحركية' },
                          { label: 'تمارين للاحتكاك الركبة', value: 'تمارين للاحتكاك الركبة' },
                          { label: 'تمارين السحب والمقاومة ', value: 'تمارين السحب والمقاومة' },
                          { label: 'تمارين المرونة ', value: 'تمارين المرونة' },
                        ]}
                      />

                    </View>

                  </Block>





                  <Block middle>

                    <View style={styles.container}>
                      <View style={styles.inputContainer}>
                        <Icon size="18" name='file-text' color="#666" type='font-awesome' />
                        <TextInput style={styles.inputs}
                          placeholder="وصف الفيديو   "
                          onChangeText={(vid_desc) => this.setState({ vid_desc })} />
                      </View>
                    </View>
                  </Block>


                  <Block middle>

                    <View style={styles.inputContainer}>
                      <Icon size="18" name='clock-o' color="#666" type='font-awesome' />
                      <TextInput style={styles.inputs}
                        placeholder="مدة التمرين بالدقائق "
                        onChangeText={(duration_in_mins) => this.setState({ duration_in_mins })} />
                    </View>

                  </Block>

                  <Block middle>
                    <View style={styles.inputContainer}>
                      <Icon size="18" name='history' color="#666" type='font-awesome' />
                      <TextInput style={styles.inputs}
                        placeholder="  عدد مرات التكرار   "
                        onChangeText={(exc_rep) => this.setState({ exc_rep })} />
                    </View>
                  </Block>

                  <Block middle>
                    <TouchableHighlight
                      onPress={this.pickDocument.bind(this)}>
                      <View style={styles.inputContainer}>
                        <Icon size="18" name='video-camera' color="#666" type='font-awesome' />
                        <Text bold style={{ color: "#000", alignContent: "flex-end", textAlign: "right" }}>  اختيار فيديو </Text>

                      </View>
                    </TouchableHighlight>
                  </Block>

                  {this.state.loading &&
                    <View style={[styles.container, styles.horizontal]}>
                      <ActivityIndicator size="large" color="#000" />
                    </View>
                  }

                  <Block center>
                    {/* <TouchableHighlight style={styles.btn}
                      onPress={this.pickDocument.bind(this)}>
                      <View style={styles.fixToText}>
                        <Text bold style={{ color: "#FFF" }}>  اختيار فيديو </Text>
                        <Icon color="#FFF" size="18" name='send' type='font-awesome' />
                      </View>
                    </TouchableHighlight> */}







                    <TouchableHighlight style={styles.btn}
                      onPress={this.addPost.bind(this)}>
                      <View style={styles.fixToText}>
                        <Text bold style={{ color: "#FFF" }}>  ارسال </Text>
                        <Icon color="#FFF" size="18" name='send' type='font-awesome' />
                      </View>

                    </TouchableHighlight>


                  </Block>


                </KeyboardAvoidingView>
              </ScrollView>
            </Block>
          </Block>
        </ImageBackground>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  baseText: {
    textAlign: 'right',
    color: 'black',
    right: 19,
    padding: 10

  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  baseText1: {
    fontSize: 20,
    padding: 20
  },
  icon: {
    paddingLeft: 6,
    color: "#FFF",
    backgroundColor: "red",
  },
  inputContainer: {
    borderBottomColor: '#f1f1f1',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderBottomWidth: 1,
    width: 300,
    height: 45,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: "right",
    paddingLeft: 20,
    justifyContent: "space-between"
  },
  registerContainer: {
    width: width * 0.9,
    height: height * 0.78,
    backgroundColor: "#F4F5F7",
    borderRadius: 4,
    alignSelf: 'center',
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4,
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
    elevation: 1,


  },
  list: {
    borderBottomColor: '#f1f1f1',
    backgroundColor: "#FFF",
    borderRadius: 10,
    borderBottomWidth: 1,
    width: 300,
    height: 45,
    marginTop: 20,
    textAlign: 'right',
    padding: 15,
    color: "black",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 20,


  },
  socialTextButtons: {
    color: argonTheme.COLORS.PRIMARY,
    fontWeight: "800",
    fontSize: 14,
    alignSelf: 'center'


  },
  button: {
    width: width - theme.SIZES.BASE * 4,
    height: theme.SIZES.BASE * 3,
    shadowRadius: 0,
    shadowOpacity: 0,
    alignSelf: 'center'

  },
  inputIcons: {
    marginRight: 12,
    textAlign: 'center',
  },
  buttonContainer: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
  },
  signupButton: {
    backgroundColor: "#FF4DFF",
    marginTop: 20,
  },
  signUpText: {
    color: 'white',
  },
  inputIcon: {
    width: 20,
    height: 20,
    marginLeft: 20,
    backgroundColor: "red",
    color: "#333",
  },
  inputs: {
    height: 45,
    marginRight: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1,
    flexDirection: "row",
    textAlign: "right",
    justifyContent: "space-between",

  },
  passwordCheck: {
    paddingLeft: 100,
    paddingTop: 13,
    paddingBottom: 30,
    alignSelf: 'center'
  },

  btn: {
    textAlign: "center",
    fontSize: 20,
    width: 200,
    borderRadius: 10,
    shadowColor: "#333",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 4,
    shadowOpacity: 0.2,
    padding: 15,
    backgroundColor: "#FF4DFF",
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20

  }
});

export default SharePost;