import React from 'react';
import {
    StyleSheet,
    View,
    Alert, Dimensions, TouchableHighlight, AsyncStorage, FlatList, ScrollView
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ListItem } from 'react-native-elements';
import { Block, Text, theme } from "galio-framework";
import { NavigationEvents } from 'react-navigation';

class PatientsList extends React.Component { //TherapistHome


    constructor(props) {
        super(props);
        this.state = {
            patients: []
        }
    }

    componentDidMount() {
        this.featchPatients();
    }

    async featchPatients() {
        let ACCESS_TOKEN = await AsyncStorage.getItem('ACCESS_TOKEN');
        ACCESS_TOKEN = ACCESS_TOKEN.replace('"', '');
        const AuthStr = `Bearer ${ACCESS_TOKEN}`;
        axios.get('http://165.22.218.109/api/patients-list', { headers: { Authorization: AuthStr } })
            .then(response => {
                this.setState({ patients: response.data.patients });
            })
            .catch((error) => {
                Alert.alert(JSON.stringify(error.response.data));
            });
    }


    keyExtractor = (item, index) => index.toString()

    renderPatients = ({ item }) => (
        <ListItem
            style={styles.list}
            rightTitleStyle={{ width: 200, alignContent: "right", textAlign: "right", color: "black" }}
            onPress={() => this.props.navigation.navigate('PatientInfo', {
                patientId: item.id
            })}
            rightTitle={item.name}
            rightSubtitle={item.email}
            rightSubtitleStyle = {{width:300,alignSelf:"flex-end",textAlign:"right"}}
            rightIcon={<Icon style={styles.icon} size="30" name='user' type='font-awesome' />
            }
            bottomDivider
        />
    )
    render() {
        return (
            <ScrollView>
                <NavigationEvents onWillFocus={() => this.featchPatients()} />
                <TouchableHighlight underlayColor="white">
                    <Block style={styles.box}>
                        <Block middle>
                            <Text bold size={20} style={styles.text}>  قائمة المراجعين </Text>
                        </Block>
                        <Separator />

                        <FlatList
                            style={{ textAlign: "center", justifyContent: "flex-end" }}
                            keyExtractor={this.keyExtractor}
                            data={this.state.patients}
                            renderItem={this.renderPatients}
                        />
                    </Block>
                </TouchableHighlight>

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
    },
    icon: {

        size: 30,
        color: "#333",
    },
    list: {
        width: 250,
        marginBottom: 20

    }
});

function Separator() {
    return <View style={styles.separator} style={{ width: 300, borderBottomWidth: StyleSheet.hairlineWidth, marginVertical: 8, borderBottomColor: '#737373' }} />;
}
export default PatientsList;