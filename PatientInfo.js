import React from 'react';
import {
  StyleSheet,
  Button,
  View,
  Alert, TouchableHighlight, AsyncStorage, ScrollView, Image, TextInput, FlatList
} from 'react-native';
import Constants from 'expo-constants';
import axios from 'axios';
import { Icon } from 'react-native-elements'
import RNPickerSelect from 'react-native-picker-select';
import { Block, Text, theme } from "galio-framework";
import { ListItem } from 'react-native-elements';

class PatientInfo extends React.Component { //TherapistHome

  constructor(props) {
    super(props);

    this.state = {
      patientId: 0,
      patient: {},
      count: 0,
      folders: [],
      folder_id: "",
      allFolders: []
    }
  }

  async featchAllFolders() {
    let ACCESS_TOKEN = await AsyncStorage.getItem('ACCESS_TOKEN');
    ACCESS_TOKEN = ACCESS_TOKEN.replace('"', '');
    const AuthStr = `Bearer ${ACCESS_TOKEN}`;
    axios.get('http://165.22.218.109/api/get-folders', { headers: { Authorization: AuthStr } })
      .then(response => {
        console.log('ssdds:' + response.data);
        this.setState({ allFolders: response.data.folders });
      })
      .catch((error) => {
        Alert.alert(error);
      });
  }

  componentWillMount() {
    const { navigation } = this.props;
    const patientId = JSON.stringify(navigation.getParam('patientId', 0));
    this.setState({ patientId: patientId });
    this.featchPatient();
    this.featchAllFolders();

  }

  handleAlert(id) {
    Alert.alert(
      'حذف المجلد',
      'هل أنت متأكد من رغبتك في حذف المشترك؟',
      [
        { text: 'نعم', onPress: () => this.handleRemoveFolder(id) },
        {
          text: 'إلغاء',
          style: 'cancel',
        },

      ],
      { cancelable: false },
    );
  }

  async featchPatient() {
    let ACCESS_TOKEN = await AsyncStorage.getItem('ACCESS_TOKEN');
    ACCESS_TOKEN = ACCESS_TOKEN.replace('"', '');
    const AuthStr = `Bearer ${ACCESS_TOKEN}`;

    axios.get(`http://165.22.218.109/api/get-patient/${this.state.patientId}`,
      { headers: { Authorization: AuthStr } })
      .then(response => {

        this.setState({ patient: response.data.patient });
        this.setState({ folders: response.data.folders });
        this.setState({ count: response.data.count });

      })
      .catch((error) => {
        Alert.alert(error);
      });
  }


  async handleRemoveFolder(folder_id) {

    let ACCESS_TOKEN = await AsyncStorage.getItem('ACCESS_TOKEN');
    ACCESS_TOKEN = ACCESS_TOKEN.replace('"', '');
    const AuthStr = `Bearer ${ACCESS_TOKEN}`;
    axios({
      method: 'POST',
      responseType: 'json',
      url: `http://165.22.218.109/api/remove-patient-from-folder`,
      data: {
        folder_id: folder_id,
        patient_id: this.state.patient.id
      }, headers: { Authorization: AuthStr }
    })
      .then(response => {
        const data = response.data;
        // Alert.alert(data.message);
        if (data.success == true) {
          this.featchPatient();
        }
      })
      .catch(err => {

        Alert.alert(err.response.data.errors);

      });
  }

  async handleAddFolder() {

    let ACCESS_TOKEN = await AsyncStorage.getItem('ACCESS_TOKEN');
    ACCESS_TOKEN = ACCESS_TOKEN.replace('"', '');
    const AuthStr = `Bearer ${ACCESS_TOKEN}`;
    axios({
      method: 'POST',
      responseType: 'json',
      url: `http://165.22.218.109/api/add-patient-to-folder`,
      data: {
        folder_id: this.state.folder_id,
        patient_id: this.state.patient.id
      }, headers: { Authorization: AuthStr }
    })
      .then(response => {
        const data = response.data;
        Alert.alert(data.message);
        if (data.success == true) {
          this.featchPatient();
        }
      })
      .catch(err => {

        if (err.response.data.errors.folder_id) {
          alert(err.response.data.errors.folder_id);
        }
        else 
        alert((err.response.data));
      });

  }
  keyExtractor = (item, index) => index.toString()

  renderItem = ({ item }) => (
    <ListItem
      style={styles.list2}
      rightTitleStyle={{ width: 200, alignContent: "right", textAlign: "right", color: "black" }}
      onPress={() => this.props.navigation.navigate('FolderInfo', {
        folder: item 
      })}
      rightTitle={item.name}
      rightIcon={<Icon style={styles.icon} color="#666" size="25" name='folder' type='font-awesome' />}
      leftIcon={<Icon style={styles.icon} color="#666" size="25" name='remove' onPress={() => this.handleAlert(item.id)} type='font-awesome' />}
      bottomDivider

    />
  )




  render() {

    const isEmpty = this.state.folders.length === 0 ? true : false;

    return (
      <ScrollView>
        <TouchableHighlight underlayColor="white" onPress={() => console.log('clicked')}>
          <Block style={styles.box}>
            <Block middle>
              <Text bold size={20} style={styles.text}> معلومات المراجع   </Text>
            </Block>
            <Separator />
            <Block middle style={{ width: 310, marginTop: 20 }}>


              <Text bold size={15} color="#32325D" style={{ width: 300, marginBottom: 20, textAlign: "right" }}>
                الإسم: {this.state.patient.name}
              </Text>



              <Text bold size={15} color="#32325D" style={{ width: 300, marginBottom: 20, textAlign: "right" }}>
                البريد الالكتروني: {this.state.patient.email}
              </Text>


              <Text bold size={15} color="#32325D" style={{ width: 300, marginBottom: 20, textAlign: "right" }}>
                تاريخ التسجيل : {this.state.patient.created_at}
              </Text>



              <Text bold size={15} color="#32325D" style={{ width: 300, marginBottom: 20, textAlign: "right" }}>
                عدد الجلسات:  {this.state.count}
              </Text>


              <Separator />
              <Text bold size={20} color="#32325D" style={{ width: 300, marginBottom: 20, textAlign: "right" }}>
                قائمة الجلسات
                            </Text>
              <Separator />

              {isEmpty ?
                (<Text size={15} color="#666" style={{ width: 300, marginBottom: 20, textAlign: "right" }}>
                  لا يوجد </Text>) : (
                  <FlatList
                    style={{ textAlign: "center", marginBottom: 20 }}
                    keyExtractor={this.keyExtractor}
                    data={this.state.folders}
                    renderItem={this.renderItem}
                  />
                )}

            </Block>

            <Separator />
            <Text bold size={20} color="#32325D" style={{ width: 300, marginBottom: 20, textAlign: "right" }}>
              إضافة جلسة جديد
              </Text>
            <Separator />


            <Block middle>
              <View style={styles.list} >
                <Icon size="18" name='folder' color="#666" type='font-awesome' />
                <RNPickerSelect
                  doneText="تم"
                  onValueChange={(folder_id) => this.setState({ folder_id })}
                  placeholder={{ label: " اختار الجلسة " }}
                  placeholderTextColor="#000"
                  items={this.state.allFolders.map(folder =>
                    ({
                      label: folder.name,
                      value: folder.id,
                    })
                  )}
                />
              </View>
            </Block>




            <TouchableHighlight style={[styles.btn]}
              onPress={this.handleAddFolder.bind(this)}>
              <Text bold style={{ color: "#FFF" }}>إضافة جلسة</Text>
            </TouchableHighlight>
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
    justifyContent: "center",
    alignItems: 'center',
    margin: 30,
    marginTop: 20,
    alignSelf: "flex-end"


  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  list2: {
    width: 300,
    marginBottom: 20
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
  }
});

function Separator() {
  return <View style={styles.separator} style={{ width: 300, borderBottomWidth: StyleSheet.hairlineWidth, marginVertical: 8, borderBottomColor: '#737373' }} />;
}
export default PatientInfo;