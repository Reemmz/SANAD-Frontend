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
// import { Icon } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';

const { width, height } = Dimensions.get("screen");
import { Header, ListItem, Card } from 'react-native-elements';
import { Block, Text, theme } from "galio-framework";
const thumbMeasure = (width - 48 - 32) / 3;
import { HeaderHeight } from "../constants/utils";

class FoldersDashboard extends React.Component { //TherapistHome


    constructor(props) {

        super(props);

        this.state = {
            user: {},
            patients: []
        }
    }

    onBack() {
        this.componentDidMount();
    }





    openProfile(patient) {




    }





    logout() {

        AsyncStorage.getAllKeys()
            .then(keys => AsyncStorage.multiRemove(keys))
            .then(() => this.props.navigation.navigate('Login'));



    }
    render() {
        return (
            <ScrollView>
                <SafeAreaView>
                    {/* 
                    <Header style={{ paddingVertical: 20 }}
                        placement="left"
                        leftComponent={{ icon: '', color: '#fff' }}
                        rightComponent={{ text: `مرحبا ، ${this.state.user.name}`, style: { fontSize: 30, color: '#fff' } }}
                    >
                        <Text style={styles.btn} onPress={this.logout.bind(this)}> خروج</Text>

                    </Header> */}



                    <TouchableHighlight underlayColor="white" onPress={() => {
                        this.props.navigation.navigate('AddFolder');
                    }}>
                        <Block style={styles.box}>
                            <Block middle>
                                <Text bold size={20} style={styles.text}> إضافة جلسة جديدة </Text>
                                <Icon style={styles.icon} size="30" name='plus-square' type='font-awesome' />
                            </Block>

                        </Block>
                    </TouchableHighlight>


                    <TouchableHighlight underlayColor="white" onPress={() => {
                        this.props.navigation.navigate('FoldersList');
                    }}>
                        <Block style={styles.box}>
                            <Block middle>
                                <Text bold size={20} style={styles.text}>  استعراض الجلسات  </Text>
                                <Icon style={styles.icon} size="30" name='list-alt' type='font-awesome' />
                            </Block>

                        </Block>
                    </TouchableHighlight>


                    <TouchableHighlight underlayColor="white" onPress={() => {
                        this.props.navigation.navigate('SharePost');
                    }}>
                        <Block style={styles.box}>
                            <Block middle>
                                <Text bold size={20} style={styles.text}> إضافة تمرين جديد  </Text>
                                <Icon style={styles.icon} size="30" name='file-text' type='font-awesome' />
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

    box: {
        // position: "relative",
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
        padding: 30
    }
    ,
    text: {

        padding: 20,
        color: "#333",
    },
    icon: {

        size: 30,
        color: "#333",
    }
});

function Separator() {
    return <View style={styles.separator} />;
}
export default FoldersDashboard;