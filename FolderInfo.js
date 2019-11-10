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

import { Block, Text, theme } from "galio-framework";
import { ListItem } from 'react-native-elements';

class FolderInfo extends React.Component { //TherapistHome

    constructor(props) {
        super(props);
        this.state = {
            folder: {},
            count: 0,
            posts: [],
            patients: [],
        }
    }


    componentWillMount() {
        const { navigation } = this.props;
        const folder = JSON.stringify(navigation.getParam('folder', 'null'));
        this.setState({ folder: JSON.parse(folder) });
        this.featchFolder();

    }

    handleAlert() {
        Alert.alert(
            'حذف الجلسة',
            'هل أنت متأكد من رغبتك في حذف الجلسة؟',
            [
                { text: 'نعم', onPress: () => this.handleDelete() },
                {
                    text: 'إلغاء',
                    style: 'cancel',
                },

            ],
            { cancelable: false },
        );
    }




    handleAlert2(id) {
        Alert.alert(
            'ازالة المشتراك',
            'هل أنت متأكد من رغبتك في ازالة المشترك؟',
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





    async handleRemoveFolder(patient_id) {

        let ACCESS_TOKEN = await AsyncStorage.getItem('ACCESS_TOKEN');
        ACCESS_TOKEN = ACCESS_TOKEN.replace('"', '');
        const AuthStr = `Bearer ${ACCESS_TOKEN}`;
        axios({
            method: 'POST',
            responseType: 'json',
            url: `http://165.22.218.109/api/remove-patient-from-folder`,
            data: {
                folder_id: this.state.folder.id,
                patient_id: patient_id
            }, headers: { Authorization: AuthStr }
        })
            .then(response => {
                const data = response.data;
                // Alert.alert(data.message);
                if (data.success == true) {
                    this.featchFolder();
                }
            })
            .catch(err => {

                Alert.alert(err.response.data.errors);

            });
    }




    async featchFolder() {
        let ACCESS_TOKEN = await AsyncStorage.getItem('ACCESS_TOKEN');
        ACCESS_TOKEN = ACCESS_TOKEN.replace('"', '');
        const AuthStr = `Bearer ${ACCESS_TOKEN}`;
        axios.get(`http://165.22.218.109/api/get-folder/${this.state.folder.id}`, { headers: { Authorization: AuthStr } })
            .then(response => {

                console.log(response.data.folder);
                this.setState({ posts: response.data.folder.posts });
                this.setState({ patients: response.data.patients });
                this.setState({ folder: response.data.folder });
                this.setState({ count: response.data.count });


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

    keyExtractor = (item, index) => index.toString()

    renderItem = ({ item }) => (
        <ListItem
            style={styles.list}
            rightTitleStyle={{ width: 200, alignContent: "right", textAlign: "right", color: "black" }}
            onPress={() => this.props.navigation.navigate('Post', {
                postId: item.id
            })}
            rightTitle={item.exc_title}
            rightSubtitle={item.exc_type}
            rightSubtitleStyle={{ width: 200, alignContent: "right", textAlign: "right", color: "#333" }}

            rightIcon={<Icon style={styles.icon} color="#666" size="25" name='file-text' type='font-awesome' />
            }
            bottomDivider
        />
    )

    renderPatients = ({ item }) => (
        <ListItem
            style={styles.list}
            rightTitleStyle={{ width: 200, alignContent: "right", textAlign: "right", color: "black" }}
            onPress={() => this.props.navigation.navigate('PatientInfo', {
                patientId: item.id
            })}

            rightTitle={item.name}
            rightSubtitle={item.email}
            rightSubtitleStyle={{ width: 200, alignContent: "right", textAlign: "right", color: "#333" }}

            rightIcon={<Icon style={styles.icon} color="#666" size="25" name='user' type='font-awesome' />}
            leftIcon={<Icon style={styles.icon} color="#666" size="25" name='remove' onPress={() => this.handleAlert2(item.id)} type='font-awesome' />}
            bottomDivider
        />
    )


    render() {

        const isEmpty = this.state.posts.length === 0 ? true : false;
        const isPatientsEmpty = this.state.patients.length === 0 ? true : false;

        return (
            <ScrollView>
                <TouchableHighlight underlayColor="white" onPress={() => console.log('clicked')}>
                    <Block style={styles.box}>
                        <Block middle>
                            <Text bold size={20} style={styles.text}> معلومات الجلسة   </Text>
                        </Block>
                        <Separator />
                        <Block middle style={{ width: 310, marginTop: 20 }}>


                            <Text bold size={18} color="#32325D" style={{ width: 300, marginBottom: 20, textAlign: "right" }}>
                                الإسم: {this.state.folder.name}
                            </Text>



                            <Text bold size={18} color="#32325D" style={{ width: 300, marginBottom: 20, textAlign: "right" }}>
                                عدد التمارين:  {this.state.count}
                            </Text>

                            <Text bold size={18} color="#32325D" style={{ width: 300, marginBottom: 20, textAlign: "right" }}>
                                عدد المشتركين:  {this.state.patients.length}
                            </Text>

                            <Separator />
                            <Text bold size={20} color="#32325D" style={{ width: 300, marginBottom: 20, textAlign: "right" }}>
                                قائمة التمارين
                            </Text>
                            <Separator />

                            {isEmpty ?
                                (<Text size={15} color="#666" style={{ width: 300, marginBottom: 20, textAlign: "right" }}>
                                    لا يوجد </Text>) : (
                                    <FlatList
                                        style={{ textAlign: "center", justifyContent: "flex-end" }}
                                        keyExtractor={this.keyExtractor}
                                        data={this.state.posts}
                                        renderItem={this.renderItem}
                                    />
                                )}


                            <Text bold size={20} color="#32325D" style={{ width: 300, marginBottom: 20, textAlign: "right" }}>
                                قائمة المشتركين
                            </Text>
                            <Separator />

                            {isPatientsEmpty ?
                                (<Text size={15} color="#666" style={{ width: 300, marginBottom: 20, textAlign: "right" }}>
                                    لا يوجد </Text>) : (
                                    <FlatList
                                        style={{ textAlign: "center", justifyContent: "flex-end" }}
                                        keyExtractor={this.keyExtractor}
                                        data={this.state.patients}
                                        renderItem={this.renderPatients}
                                    />
                                )}



                            
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
export default FolderInfo;