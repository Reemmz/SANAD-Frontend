
import React, { useState, Component } from 'react';

import {
  StyleSheet, View, TextInput,
  ImageBackground,
  Image,
  StatusBar,
  Dimensions,AsyncStorage
} from "react-native";
import { Block, Button, Text, theme } from  "galio-framework";

const { height, width } = Dimensions.get("screen");

import argonTheme from "../constants/Theme";
import Images from "../constants/Images";


export default class HomeScreen extends Component {


  componentDidMount(){
  
      // AsyncStorage.getAllKeys()
      //     .then(keys => AsyncStorage.multiRemove(keys))
      //     .then(() => alert('success'));
  
  }
    render() {

        return (


            <Block flex style={styles.container}>
            <StatusBar hidden />
            <Block flex center>
            <ImageBackground
                source={Images.Onboarding}
                style={{ height, width, zIndex: 1 }}
              />
            </Block>
            <Block center>
           <Image source={Images.LogoOnboarding} style={styles.logo} />
            </Block>
            <Block flex space="between" style={styles.padded}>
                <Block flex space="around" style={{ zIndex: 2 }}>
                  <Block style={styles.title}>
                    <Block>
                      <Text color="white" size={20}>
    سند هو تطبيق يستهدف المرضى والمعالجين الطبيعيين لتهيئة المرضى لأداء التمارين العلاجية بشكل أفضل بمساعدة المعالجين الطبيعيين
                      </Text>
                    </Block>
                    <Block>
                      <Text color="white" size={60}>
                       
                      </Text>
                    </Block>
                    <Block style={styles.subTitle}>
                      <Text color="white" size={16}>
                  
                      </Text>
                    </Block>
                  </Block>
                  <Block center>
                    <Button
                      style={styles.button}
                      color={argonTheme.COLORS.SECONDARY}
                      onPress={() => this.props.navigation.navigate('Login')}
                      textStyle={{ color: argonTheme.COLORS.BLACK }}
                    >
                     تسجيل الدخول
                    </Button>
                    <Text></Text>
                    <Block center>
                    <Button
                      style={styles.button}
                      color={argonTheme.COLORS.SECONDARY}
                      onPress={() => this.props.navigation.navigate('Register')}
                      textStyle={{ color: argonTheme.COLORS.BLACK }}
                    >
                    الاشتراك
                    </Button></Block>
                  </Block>
              </Block>
            </Block>
          </Block>
        );
    }
}



const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.COLORS.BLACK,
   
  },
  padded: {
    paddingHorizontal: theme.SIZES.BASE * 2,
    position: "relative",
    bottom: theme.SIZES.BASE,
    zIndex: 2,
  },
  button: {
    width: width - theme.SIZES.BASE * 4,
    height: theme.SIZES.BASE * 3,
    shadowRadius: 0,
    shadowOpacity: 0
  },
  logo: {
    width: 200,
    height: 60,
    zIndex: 2,
    position: 'relative',
    marginTop: '-50%'
  },
  title: {
    marginTop:'-5%'
  },
  subTitle: {
    marginTop: 20
  }
});



// import React, { useState, Component } from 'react';
// import { StyleSheet, Text, View, Button, TextInput } from 'react-native';

// export default class HomeScreen extends Component {

//     render() {

//         return (
//             <View>

//                 <Text>Home  Screen</Text>

                
//                 <Button
//                     title="Login"
//                     onPress={() => this.props.navigation.navigate('Login')}
//                 />


//                 <Button
//                     title="Register"
//                     onPress={() => this.props.navigation.navigate('Register')}
//             />
//             </View>

//         );
//     }
// }