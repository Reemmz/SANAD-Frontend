import React from 'react';
import {
    StyleSheet,
    Button,
    View,
    Alert, TouchableHighlight, AsyncStorage, ScrollView, Image, TextInput
} from 'react-native';
import Constants from 'expo-constants';
import axios from 'axios';
// import { Icon } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';

import { Block, Text, theme } from "galio-framework";

class EditFolder extends React.Component { //TherapistHome


    constructor(props) {
        super(props);
        this.state = {
            folder: {}
        }
    }


    componentDidMount() {
        const { navigation } = this.props;
        const folder = JSON.stringify(navigation.getParam('folder', 'null'));
        this.setState({ folder: JSON.parse(folder) });


    }

    handleChange(name) {

        let folderCopy = JSON.parse(JSON.stringify(this.state.folder))
        folderCopy.name = name;
        this.setState({
            folder: folderCopy
        })
    }

    async editFolder() {

        const { name } = this.state.folder.name;
        if (name == "") {
            Alert.alert("Enter foolder name please.");
            return;
        }

        let ACCESS_TOKEN = await AsyncStorage.getItem('ACCESS_TOKEN');
        ACCESS_TOKEN = ACCESS_TOKEN.replace('"', '');
        const AuthStr = `Bearer ${ACCESS_TOKEN}`;

        axios({
            method: 'POST',
            responseType: 'json',
            url: `http://165.22.218.109/api/edit-folder`,
            data: {
                folder_id:this.state.folder.id,
                name: this.state.folder.name,
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
        return (
            <ScrollView>
                
                <TouchableHighlight underlayColor="white" onPress={() => console.log('clicked')}>
                    <Block style={styles.box}>
                        <Block middle>
                            <Text bold size={20} style={styles.text}>تعديل المجلد </Text>
                        </Block>
                        <Separator />
                        <Block middle style={{ width: 200 }}>
                            <View>

                                <TextInput
                                    placeholder="اسم المجلد"
                                    style={styles.input}
                                    onChangeText={this.handleChange.bind(this)}
                                    value={this.state.folder.name} />

                            </View>

                            <TouchableHighlight style={[styles.btn]}
                                onPress={this.editFolder.bind(this)}>
                                <View style={styles.fixToText}>
                                    <Text bold style={{ color: "#FFF" }}>  حفظ </Text>
                                    <Icon style={styles.icon} size="18" name='save' type='font-awesome' />
                                </View>
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
        color: "#333",
    },
    icon: {
        paddingLeft: 6,
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
        width: 120,
        height: 45,
        borderRadius: 20,
        shadowColor: "#333",
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 4,
        shadowOpacity: 0.2,
        padding: 10,
        backgroundColor: "#FF4DFF",
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 30,
        marginTop: 40,

    },
    fixToText: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

function Separator() {
    return <View style={styles.separator} style={{ width: 300, borderBottomWidth: StyleSheet.hairlineWidth, marginVertical: 8, borderBottomColor: '#737373' }} />;
}
export default EditFolder;