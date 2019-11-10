import React from 'react';
import {
    StyleSheet,
    View,
    Alert, TouchableHighlight, AsyncStorage, ScrollView, TextInput
} from 'react-native';
import Constants from 'expo-constants';
import axios from 'axios';
// import { Icon } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';
import { Block, Text, theme } from "galio-framework";
class AddPatient extends React.Component { //TherapistHome
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            username: "",
            email: "",
            password: "",
            error: "",
        }
    }

    async addPatient() {
        const { name, username, email, password } = this.state;
        if (name == "" || username == "" || email == "" || password == "") {
            alert('جميع الحقول مطلوبة');
            return;

        }

        let ACCESS_TOKEN = await AsyncStorage.getItem('ACCESS_TOKEN');
        ACCESS_TOKEN = ACCESS_TOKEN.replace('"', '');
        const AuthStr = `Bearer ${ACCESS_TOKEN}`;

        axios({
            method: 'POST',
            responseType: 'json',
            url: `http://165.22.218.109/api/add-patient`,
            data: {
                name: this.state.name,
                username: this.state.username,
                email: this.state.email,
                password: this.state.password
            }, headers: { Authorization: AuthStr }
        })
            .then(response => {


                this.setState({ name: '' });
                this.setState({ username: "" });
                this.setState({ email: "" });
                this.setState({ password: "" });
                Alert.alert("A new patient has been added successfully!");
                const data = response.data;
                if (data.success == true) {
                    this.props.navigation.navigate('PatientsList');
                }
            })
            .catch(err => {
                if (err.response.data.errors.username) {
                    alert(err.response.data.errors.username);
                    return;
                }
                if (err.response.data.errors.email) {
                    alert(err.response.data.errors.email);
                    return;
                }
                if (err.response.data.errors.password) {
                    alert(err.response.data.errors.password);
                    return;
                }
                alert(err.response.data);
                return;
            });

    }


    render() {
        return (
            <ScrollView>
                <TouchableHighlight underlayColor="white" onPress={() => console.log('clicked')}>


                    <Block style={styles.box}>
                        <Block middle>
                            <Text bold size={20} style={styles.text}> إضافة مراجع جديد </Text>
                        </Block>
                        <Separator />
                        <Block middle style={{ width: 200 }}>
                            <View>
                                <TextInput
                                    placeholder="الاسم "
                                    style={styles.input}
                                    onChangeText={(name) => this.setState({ name })} />
                            </View>

                            <View>
                                <TextInput
                                    placeholder="اسم المستخدم "
                                    style={styles.input}
                                    onChangeText={(username) => this.setState({ username })} />
                            </View>

                            <View>
                                <TextInput
                                    placeholder="البريد الالكتروني  "
                                    style={styles.input}
                                    onChangeText={(email) => this.setState({ email })} />
                            </View>

                            <View>
                                <TextInput
                                    placeholder="كلمة المرور   "
                                    style={styles.input}
                                    secureTextEntry={true}
                                    onChangeText={(password) => this.setState({ password })} />
                            </View>



                            <TouchableHighlight style={[styles.btn]}
                                onPress={this.addPatient.bind(this)}>
                                <Text bold style={{ color: "#FFF" }}>إضافة</Text>
                            </TouchableHighlight>

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
export default AddPatient;