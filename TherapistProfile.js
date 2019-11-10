import React from 'react';
import {
    StyleSheet,
    Button,
    View,
    Alert, TouchableHighlight, AsyncStorage, ScrollView, Image, TextInput, FlatList,SafeAreaView
} from 'react-native';
import Constants from 'expo-constants';
import axios from 'axios';
import { Icon } from 'react-native-elements'
import RNPickerSelect from 'react-native-picker-select';
import { Block, Text, theme } from "galio-framework";
import { Header, ListItem, Card, Badge, Avatar } from 'react-native-elements';

class TherpaistProfile extends React.Component { //TherapistHome

    constructor(props) {
        super(props);

        this.state = {
            therapist: {},
            showNotifications: false,
            user: {},
            notifications: [],
            unreadNotificationsCount: 0
        }
    }


    componentWillMount() {
        this.featchTherapist();
        this.featchUser();
    }

    logout() {
        AsyncStorage.getAllKeys()
            .then(keys => AsyncStorage.multiRemove(keys))
            .then(() => this.props.navigation.navigate('Login'));
    }

    toggleNotifications() {
        this.setState({
            showNotifications: !this.state.showNotifications
        });

        this.readNotifications();

    }
    async readNotifications() {
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



    async featchTherapist() {
        let ACCESS_TOKEN = await AsyncStorage.getItem('ACCESS_TOKEN');
        ACCESS_TOKEN = ACCESS_TOKEN.replace('"', '');
        const AuthStr = `Bearer ${ACCESS_TOKEN}`;
        axios.get(`http://165.22.218.109/api/therapist`,
            { headers: { Authorization: AuthStr } })
            .then(response => {
                this.setState({ therapist: response.data.therapist });

            })
            .catch((error) => {
                Alert.alert(error);
            });
    }



    render() {
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

                            <View style={{ marginTop: -21, padding: 8, marginLeft: -8 }} >
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

                    <TouchableHighlight underlayColor="white" onPress={() => console.log('clicked')}>
                        <Block style={styles.box}>
                            <Block middle>
                                <Text bold size={20} style={styles.text}> معلومات المعالج   </Text>
                            </Block>



                            <View style={{ flex: 1, alignContent: "center", alignItems: "center", marginTop: 15, marginBottom: 10 }}>
                                <Avatar
                                    size="large"
                                    rounded
                                    source={{
                                        uri:
                                            'https://st2.depositphotos.com/4226061/9064/v/950/depositphotos_90647730-stock-illustration-female-doctor-avatar-icon.jpg',
                                    }}
                                />
                            </View>

                            <Block middle style={{ width: 310, marginTop: 20 }}>

                                <Text bold size={15} color="#32325D" style={{ width: 300, marginBottom: 20, textAlign: "right" }}>
                                    الإسم: {this.state.therapist.name}
                                </Text>
                                <Separator />


                                <Text bold size={15} color="#32325D" style={{ width: 300, marginBottom: 20, textAlign: "right" }}>
                                    البريد الالكتروني: {this.state.therapist.email}
                                </Text>
                                <Separator />
                                <Text bold size={15} color="#32325D" style={{ width: 300, marginBottom: 30, textAlign: "right" }}>
                                    رقم الرخصة: {this.state.therapist.license}
                                </Text>
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
    },
    icon2: {
        size: 20,
        color: "#FFF",
        marginEnd: 10,
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
        height: 200,
        color:"#000"
    },
    list_noti: {
        width: 210,
        textAlign: "left",
        overflow: "scroll",
        padding: 5
    }
});

function Separator() {
    return <View style={styles.separator} style={{ width: 300, borderBottomWidth: StyleSheet.hairlineWidth, marginVertical: 8, marginBottom: 20, borderBottomColor: '#737373' }} />;
}
export default TherpaistProfile;