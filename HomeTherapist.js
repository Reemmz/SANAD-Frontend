import React from 'react';
import {
  StyleSheet,
  Button,
  View,
  SafeAreaView,
  Alert, Dimensions, TouchableHighlight, AsyncStorage, FlatList, ScrollView
} from 'react-native';
import Constants from 'expo-constants';
import axios from 'axios';
import { Icon } from 'react-native-elements'

const { width, height } = Dimensions.get("screen");
import { Header, ListItem, Card, Badge, Avatar } from 'react-native-elements';

import { Block, Text, theme } from "galio-framework";
const thumbMeasure = (width - 48 - 32) / 3;
import { HeaderHeight } from "../constants/utils";

class HomeTherapist extends React.Component { //TherapistHome


  constructor(props) {

    super(props);

    this.state = {
      patients: [],
      showNotifications: false,
      user: {},
      notifications: [],
      unreadNotificationsCount: 0
    }
  }



  logout() {
    AsyncStorage.getAllKeys()
      .then(keys => AsyncStorage.multiRemove(keys))
      .then(() => this.props.navigation.navigate('Login'));
  }

  async featchUser() {
    let ACCESS_TOKEN = await AsyncStorage.getItem('ACCESS_TOKEN');
    ACCESS_TOKEN = ACCESS_TOKEN.replace('"', '');
    const AuthStr = `Bearer ${ACCESS_TOKEN}`;
    axios.get(`http://165.22.218.109/api/get-user`, { headers: { Authorization: AuthStr } })
      .then(response => {
        this.setState({ user: response.data.user });
        this.setState({ notifications: response.data.notifications });
        this.setState({ unreadNotificationsCount: response.data.count });

      })
      .catch((error) => {
        Alert.alert(error);
      });
  }
  toggleNotifications() {
    this.setState({
      showNotifications: !this.state.showNotifications
    });

    this.readNotifications();

  }

  async readNotifications() {
    this.setState({ usunreadNotificationsCounter: 0 });
    let ACCESS_TOKEN = await AsyncStorage.getItem('ACCESS_TOKEN');
    ACCESS_TOKEN = ACCESS_TOKEN.replace('"', '');
    const AuthStr = `Bearer ${ACCESS_TOKEN}`;
    axios.get(`http://165.22.218.109/api/read-notifications`, { headers: { Authorization: AuthStr } })
      .then(response => {
        console.log('done');
        this.setState({ usunreadNotificationsCounter: 0 });
      })
      .catch((error) => {
        Alert.alert(error);
      });
  }



  keyExtractor = (item, index) => index.toString()
  renderItem = ({ item }) => (
    <ListItem
      style={styles.list_noti}
      rightTitleStyle={{ fontSize: 11, width: 190, alignContent: "center", textAlign: "center", color: "black" }}
      rightTitle={item.data.body}
      bottomDivider
    />
  )



  onBack() {
    this.componentDidMount();
  }


  async componentDidMount() {
    let ACCESS_TOKEN = await AsyncStorage.getItem('ACCESS_TOKEN');
    ACCESS_TOKEN = ACCESS_TOKEN.replace('"', '');
    // console.log("TOKEN: " + ACCESS_TOKEN);
    const AuthStr = `Bearer ${ACCESS_TOKEN}`;
    // console.log("AUTH: " + AuthStr);

    axios.get('http://165.22.218.109/api/user', { headers: { Authorization: AuthStr } })
      .then(response => {
        // console.log(response.data);
        this.setState({ user: response.data });
        // console.log(this.state.user);
      })
      .catch((error) => {
        console.log('error ' + error);
        console.log('error ' + error.data);
      });


    axios.get('http://165.22.218.109/api/patients-list', { headers: { Authorization: AuthStr } })
      .then(response => {
        // console.log("Patients:    :::::" + response.data);
        this.setState({ patients: response.data.patients });

        // console.log(this.state.patients);

      })
      .catch((error) => {
        alert(error);
        console.log('error ' + error);
        console.log('error ' + error.data);
      });


  }



  openProfile(patient) {
    this.props.navigation.navigate('PatientInfo', {
      patient_id: patient.id,
    });

  }


  keyExtractor = (item, index) => index.toString()

  renderItem = ({ item }) => (
    <ListItem
      onPress={() => this.openProfile(item)}
      title={item.name}
      subtitle={item.username}
      leftAvatar={{ source: { uri: 'https://st2.depositphotos.com/4226061/9064/v/950/depositphotos_90647730-stock-illustration-female-doctor-avatar-icon.jpg' } }}
      bottomDivider
      chevron
    />
  )


  logout() {

    AsyncStorage.getAllKeys()
      .then(keys => AsyncStorage.multiRemove(keys))
      .then(() => this.props.navigation.navigate('Login'));



  }
  render() {

    const { navigation } = this.props

    return (
      <ScrollView>
        <SafeAreaView>



          {/* Header start */}
          <View style={styles.fixToText2}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
              <Icon style={styles.icon2} size="20" name='sign-out' onPress={this.logout.bind(this)} color="white" type='font-awesome' />

              <View style={{ marginTop: -21, padding: 8, marginLeft: 6 }} >
                <Badge textStyle={{ fontSize: 10 }} style={{ padding: -40 }} value={this.state.unreadNotificationsCount} status="error" onPress={() => console.log('hi')} />
                <Icon style={styles.icon2} size="18" name='bell' onPress={this.toggleNotifications.bind(this)} color="white" type='font-awesome' />

              </View>
            </View>

            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>

              <Text size={14} color="#FFF" style={{ padding: 5, marginHorizontal: 10 }} >
                مرحبا، {this.state.user.name}
              </Text>
              <Avatar
                size="small"
                rounded
                source={{
                  uri: 'https://cdn2.iconfinder.com/data/icons/circle-avatars-1/128/048_girl_avatar_profile_woman_waiter_butler-512.png',
                }}
              />
            </View>
          </View>
          {/* Header end */}

          {this.state.showNotifications &&
            <Block style={styles.noti_box}>
              <Block middle>
                <Block middle>

                  <ScrollView>

                    <FlatList
                      style={{ textAlign: "center", marginBottom: 20 }}
                      keyExtractor={this.keyExtractor}
                      data={this.state.notifications}
                      renderItem={this.renderItem}
                    />
                  </ScrollView>



                </Block>
              </Block>

            </Block>
          }


          <TouchableHighlight underlayColor="white" onPress={() => {
            this.props.navigation.navigate('FoldersDashboard');
          }} >
            <Block flex style={styles.profileCard} >
              <Block middle style={styles.avatarContainer} >
                <Text bold size={65}> </Text>
                <Text bold size={28} color="#32325D" style={{ marginTop: 40, paddingBottom: 24 }}> الجلسات </Text>
                <Icon size={50} name='folder' />
              </Block>

              <Block
                middle
                row
                space="evenly"
                style={{ marginTop: 20, paddingBottom: 24 }}>

              </Block>
            </Block>
          </TouchableHighlight>

          <TouchableHighlight underlayColor="white" onPress={() => {
            this.props.navigation.navigate('PatientsDashboard');
          }} >
            <Block flex style={styles.profileCard} >
              <Block middle style={styles.avatarContainer} >
                <Text bold size={65}> </Text>
                <Text bold size={28} color="#32325D" style={{ marginTop: 40, paddingBottom: 24 }}> المراجعين </Text>
                <Icon size={50} name='people' />
              </Block>

              <Block
                middle
                row
                space="evenly"
                style={{ marginTop: 20, paddingBottom: 24 }}>

              </Block>
            </Block>
          </TouchableHighlight>


          <TouchableHighlight underlayColor="white" onPress={() => {
            this.props.navigation.navigate('Chat');
          }} >
            <Block flex style={styles.profileCard} >
              <Block middle style={styles.avatarContainer} >
                <Text bold size={65}> </Text>
                <Text bold size={28} color="#32325D" style={{ marginTop: 40, paddingBottom: 24 }}> الرسائل </Text>
                <Icon size={50} name='comment' />
              </Block>

              <Block
                middle
                row
                space="evenly"
                style={{ marginTop: 20, paddingBottom: 24 }}>

              </Block>
            </Block>
          </TouchableHighlight>

        </SafeAreaView>
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
  title: {
    textAlign: 'center',
    marginVertical: 8,
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    margin: 8,
    borderRadius: 8,
    color: '#FFF',
    paddingLeft: 10,
    paddingRight: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    minWidth: 50
  },
  signupButton: {
    backgroundColor: "#FF4DFF",
    color: 'white'
  },
  btn: {
    color: 'white',

  },
  profile: {
    marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
    // marginBottom: -HeaderHeight * 2,
    flex: 1
  },
  profileContainer: {
    width: width,
    height: height,
    padding: 0,
    zIndex: 1
  },
  profileBackground: {
    width: width,
    height: height / 2
  },
  profileCard: {
    // position: "relative",
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: 65,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 2
  },
  info: {
    paddingHorizontal: 40
  },
  avatarContainer: {
    position: "relative",
    marginTop: -80
  },
  avatar: {
    width: 124,
    height: 124,
    borderRadius: 62,
    borderWidth: 0
  },
  nameInfo: {
    marginTop: 35
  },
  divider: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#E9ECEF"
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    backgroundColor: '#ecf0f1',
    borderColor: '#d6d7da',
  },
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: "center",
    width: thumbMeasure,
    height: thumbMeasure
  },
  icon2: {
    size: 20,
    color: "#FFF",
    marginEnd: 20,
    marginRight:10,
    
  },
  icon3: {
    color: "#000",
  },
  fixToText2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: "#4527a0",
    padding: 20,
    shadowColor: "#FFF",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
  },
  noti_box: {
    position: 'absolute',
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: 40,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 10,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
    padding: 8,
    width: 220,
    height: 200
  },
  list_noti: {
    width: 210,
    textAlign: "left",
    overflow: "scroll",
    padding: 5
  }
});

function Separator() {
  return <View style={styles.separator} />;
}
export default HomeTherapist;