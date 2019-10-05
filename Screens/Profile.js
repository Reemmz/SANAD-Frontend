import React from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  ImageBackground,
  Platform
} from "react-native";
import { Block, Text, theme } from "galio-framework";
import DialogInput from 'react-native-dialog-input';


import { Images, argonTheme } from "../constants";
import { HeaderHeight } from "../constants/utils";

const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;

class Profile extends React.Component {


  constructor(props) {

    super(props);

    this.checkIfLogged();
    this.state = {
      email: "",
      password: "",

    }

  }


  async checkIfLogged() {

    let token = await AsyncStorage.getItem('ACCESS_TOKEN');
    // alert(token);
    if (token != undefined && token != null) {
      this.props.navigation.navigate('Post');
    }

  }

  async onSavePasswordPressed() {

    const { password } = this.state;
    if (password == "") {
      alert('Empty Paaword!');
      return;
    }
    axios({
      method: 'POST',
      responseType: 'json',
      url: `http://165.22.218.109/api/EditPassword/`,
      data: {
        password: this.state.password
      }
    })
    .then(response => {
      const data = response.data;
      if (data.success == true) {
        this.storeToken(data.token_data.access_token);
        this.props.navigation.navigate('Profile');
      }

    })
    .catch(err => {


      
      if (err.response.data.errors.password) {
        alert(err.response.data.errors.password);
        return;
      }


     
    });

  }//end of onEditPasswordPressed


  async onEditEmailPressed() {

    const { emailsword } = this.state;
    if (password == "") {
      alert('Invalid Email!');
      return;
    }
    axios({
      method: 'POST',
      responseType: 'json',
      url: `http://165.22.218.109/api/EditEmail/`,
      data: {
        email: this.state.email
      }
    })
    .then(response => {
      const data = response.data;
      if (data.success == true) {
        this.storeToken(data.token_data.access_token);
        this.props.navigation.navigate('Profile');
      }

    })
    .catch(err => {


      if (err.response.data.errors.email) {
        alert(err.response.data.errors.email);
        return;
      }
      


      // ***
      return;
    });

  }//end of onEditEmailPressed

  async storeToken(token) {
    try {
      await AsyncStorage.setItem('ACCESS_TOKEN', token);

    } catch (err) {
      console.log('error during storing token: ', err);
    }
  }


  render() {
    return (
      <Block flex style={styles.profile}>
        <Block flex>
          <ImageBackground
            source={Images.ProfileBackground}
            style={styles.profileContainer}
            imageStyle={styles.profileBackground}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ width, marginTop: '25%' }}
            >
              <Block flex style={styles.profileCard}>


                <Block flex>
                  <Block middle style={styles.nameInfo}>
                    <Text bold size={28} color="#32325D">
                      البيانات الشخصية
                    </Text>
                    <Text size={18} color="#32325D" style={{ alignSelf: "center", marginTop: 30 }}>
                      الاسم:
                    </Text>

                    <Text size={16} color="#32325D" style={{ alignSelf: "center", marginTop: 15 }}>
                    </Text>

                    <Text size={18} color="#32325D" style={{ alignSelf: "center", marginTop: 10 }}>
                      كلمة المرور :
                    </Text>

                    <Text size={16} color="#32325D" style={{ alignSelf: "center", marginTop: 15 }}>
                   
                    </Text>

                    <TouchableHighlight style={[styles.buttonContainer, styles.signupButton]}
                      onPress={<DialogInput isDialogVisible={this.state.isDialogVisible}
                        title={"تعديل كلمة المرور"}
                        message={"رجاء ادخل كلمة المرور الجديدة"}
                        submitInput={(inputText) => this.onSavePasswordPressed.bind(this)}
                        closeDialog={() => { this.showDialog(false) }}>
                      </DialogInput>}>
                      <Text style={styles.signUpText}>تعديل </Text>
                    </TouchableHighlight>


                    <Text size={18} color="#32325D" style={{ alignSelf: "center", marginTop: 10 }}>
                      البريد الالكتروني:
                    </Text>

                    <Text size={16} color="#32325D" style={{ alignSelf: "center", marginTop: 15 }}>
                    </Text>

                    <TouchableHighlight style={[styles.buttonContainer, styles.signupButton]}
                      onPress={<DialogInput isDialogVisible={this.state.isDialogVisible}
                        title={"تعديل البريد الالكتروني "}
                        message={"رجاء ادخل البريد الالكتروني الجديد  "}
                        submitInput={(inputText) => this.onEditEmailPressed.bind(this)}
                        closeDialog={() => { this.showDialog(false) }}>
                      </DialogInput>}>
                      <Text style={styles.signUpText}>تعديل </Text>
                    </TouchableHighlight>

                  </Block>

                  <Block
                    row
                    style={{ paddingBottom: 20, justifyContent: "flex-end" }}
                  >

                  </Block>
                  <Block style={{ paddingBottom: -HeaderHeight * 2 }}>

                  </Block>
                </Block>
              </Block>
            </ScrollView>
          </ImageBackground>
        </Block>
        {}
      </Block>
    );
  }
}

const styles = StyleSheet.create({
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

  nameInfo: {
    marginTop: 35
  },
  divider: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#E9ECEF"
  },
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: "center",
    width: thumbMeasure,
    height: thumbMeasure
  }
});

export default Profile;
