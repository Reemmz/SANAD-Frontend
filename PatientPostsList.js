import React from 'react';
import {
    StyleSheet,
    View,
    Alert, Dimensions, TouchableHighlight, AsyncStorage, FlatList, ScrollView,SafeAreaView
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Block, Text, theme } from "galio-framework";
import { NavigationEvents } from 'react-navigation';
import { Header, ListItem, Card, Badge, Avatar } from 'react-native-elements';

class PatientPostsList extends React.Component { //TherapistHome


    constructor(props) {
        super(props);
        this.state = {
            folder_id: 0,
            folder: {},
            posts: [],
            completedCount: 0,
            token: "",
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

    keyExtractor = (item, index) => index.toString()
    renderItem = ({ item }) => (
        <ListItem
            style={styles.list_noti}
            rightTitleStyle={{ fontSize: 11, width: 190, alignContent: "center", textAlign: "center", color: "black" }}
            rightTitle={item.data.body}
            bottomDivider
        />
    )


    componentDidMount() {
        const { navigation } = this.props;
        const folder_id = JSON.stringify(navigation.getParam('folderId', 0));
        this.setState({ folder_id: folder_id });
        this.featchUser();
        this.featchPosts();
        this.getCompletedCount();
    }

    async featchPosts() {
        let ACCESS_TOKEN = await AsyncStorage.getItem('ACCESS_TOKEN');
        ACCESS_TOKEN = ACCESS_TOKEN.replace('"', '');

        this.setState({ token: ACCESS_TOKEN });

        const AuthStr = `Bearer ${ACCESS_TOKEN}`;
        axios.get(`http://165.22.218.109/api/patient-posts/${this.state.folder_id}`, { headers: { Authorization: AuthStr } })
            .then(response => {
                this.setState({ fodler: response.data.folder });
                this.setState({ posts: response.data.posts });
            })
            .catch((error) => {
                Alert.alert(error);
            });
    }

    async getCompletedCount() {
        let ACCESS_TOKEN = await AsyncStorage.getItem('ACCESS_TOKEN');
        ACCESS_TOKEN = ACCESS_TOKEN.replace('"', '');
        const AuthStr = `Bearer ${ACCESS_TOKEN}`;
        axios.get(`http://165.22.218.109/api/all-completed/${this.state.folder_id}`, { headers: { Authorization: AuthStr } })
            .then(response => {
                this.setState({ completedCount: response.data.count });
            })
            .catch((error) => {
                Alert.alert(error);
            });
    }

    isCompleted(post_id) {
        console.log('called', post_id);
    }






    keyExtractor = (item, index) => index.toString()

    renderItem = ({ item }) => (
        <ListItem
            style={styles.list2}
            rightTitleStyle={{ width: 200, alignContent: "right", textAlign: "right", color: "black" }}
            onPress={() => this.props.navigation.navigate('Post', {
                postId: item.id
            })}
            rightTitle={item.exc_title}
            leftIcon={this.isCompleted(item.id) && <Icon style={styles.icon2} size="30" name='check-circle' type='font-awesome' />}
            rightIcon={<Icon style={styles.icon} size="30" name='play-circle' type='font-awesome' />
            }
            bottomDivider
        />
        
    )
    render() {
        return (
            <ScrollView>
                {/* <NavigationEvents onWillFocus={() => this.featchFolders()} /> */}

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

                    <TouchableHighlight underlayColor="white">

                        <Block style={styles.box}>
                            <Block middle style={{ direction: "rtl" }}>
                                <Text bold size={20} style={styles.text}>  قائمة التمارين </Text>
                                <Text>
                                    أكملت {this.state.completedCount} من {this.state.posts.length} تمرين
                         </Text>

                            </Block>
                            <Separator />

                            <FlatList
                                style={{ textAlign: "center", justifyContent: "flex-end" }}
                                keyExtractor={this.keyExtractor}
                                data={this.state.posts}
                                renderItem={this.renderItem}
                            />
                        </Block>
                    </TouchableHighlight>
                </SafeAreaView>
            </ScrollView>
        );
    }
}
const styles = StyleSheet.create({
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
        padding: 30,
        marginBottom: 50
    }
    ,
    text: {

        padding: 20,
        color: "#333",
        direction: "rtl"
    },
    icon: {

        size: 30,
        color: "#333",
    },

    icon2: {

        size: 30,
        color: "green",

    },
    list2: {
        width: 320,
        marginBottom: 20

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
        height: 200
    },
    list_noti: {
        width: 210,
        textAlign: "left",
        overflow: "scroll",
        padding: 5,
        color:"#000"
    },
    list: {
        width: 250,
        marginBottom: 20,
        color:"#000"
    }
});

function Separator() {
    return <View style={styles.separator} style={{ width: 300, borderBottomWidth: StyleSheet.hairlineWidth, marginVertical: 8, borderBottomColor: '#737373' }} />;
}
export default PatientPostsList;