import React from "react";

import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
Text,
View,
  KeyboardAvoidingView
} from "react-native";
import { Block, theme } from "galio-framework";

import { Button, Icon, Input } from "../components";
import { Images, argonTheme } from "../constants";
import RNPickerSelect from 'react-native-picker-select';
import { TextInput } from "react-native-gesture-handler";


const { width, height } = Dimensions.get("screen");

class Register extends React.Component {
  render() {
    return (
      <Block flex >
        <StatusBar hidden />
        <ImageBackground
          source={Images.RegisterBackground}
          style={{ width, height, zIndex: 1 }}
        >
          <Block flex middle>
            <Block style={styles.registerContainer}>
             
              <Block flex={0.25} middle style={styles.socialConnect}>
                <Text color="#8898AA" size={12}>
                
              سند 
              {'\n'}
{'\n'}
              رفع  فيديو جديد

                </Text>

              </Block>

             
                
                  
                  <KeyboardAvoidingView
                  style={{ flex: 1  }}
                    behavior="padding"
                  enabled
                  >
                    <View>
                      <Text style={styles.baseText}>
{'\n'}
                         عنوان التمرين :  
                         {'\n'}
                      </Text>
                     <Block middle>
                      <Block  width={width * 0.8} >
                     <Input
                        borderless
                        placeholder=" ظهر ، ساق ، رقبه ... "
                        iconContent={
                          <Icon
                            size={10}
                            color={argonTheme.COLORS.ICON}
                            //name="hat-3"
                           // family="ArgonExtra"
                            style={styles.inputIcons}
                          />
                        }

                      />
                      </Block>
                      </Block>
                      </View>

                      <View>
                      <Text style={styles.baseText}>
{'\n'}
                         نوع التمرين :  
                         {'\n'}
                      </Text>
                     <Block middle>
                     
<View style={styles.list}> 
                    < RNPickerSelect 
        
            onValueChange={(value) => console.log(value)}
            items={[ 
                {  label: 'ظهر', value: 'back' },
                { label: 'ساق', value: 'leg' },
                { label: 'رقبه', value: 'ragabah' },
                { label: 'ركبه', value: 'rkbah' },
                { label: 'اليد', value: 'hand' },
                { label: 'الكتف', value: 'handd' },

            ]}
        /></View>

                      </Block>
                      </View>
                    
        
           
                    <View>
                      <Text style={styles.baseText}>
{'\n'}
                      رابط اليوتيوب :  
                         {'\n'}
                      </Text>
                     <Block middle>
                      <Block  width={width * 0.8} >
                     <Input
                        borderless
                        placeholder=" الرابط "
                        iconContent={
                          <Icon
                            size={10}
                            color={argonTheme.COLORS.ICON}
                            //name="hat-3"
                           // family="ArgonExtra"
                            style={styles.inputIcons}
                          />
                        }

                      />
                      </Block>
                      </Block>
                      </View> 

                      <View>
                      <Text style={styles.baseText}>
{'\n'}
                         الوصف :  
                         {'\n'}
                      </Text>
                     <Block middle>
                      <Block  width={width * 0.8} >
                     <Input
                        borderless
                        placeholder="  وصف الفيديو  "
                        iconContent={
                          <Icon
                            size={10}
                            color={argonTheme.COLORS.ICON}
                            //name="hat-3"
                           // family="ArgonExtra"
                            style={styles.inputIcons}
                          />
                        }

                      />
                      </Block>
                      </Block>
                      </View>

                        <Text>{'\n'}
                         </Text> 

                
                    <Block center>
                <Button
                  style={styles.button}
                 // color={argonTheme.COLORS.SECONDARY}
                  //onPress={() => navigation.navigate("Home")}
                  textStyle={{ color: argonTheme.COLORS.BLACK }}
                >
رفع الفيديو           </Button>
              </Block>
                          

                  </KeyboardAvoidingView>
                </Block>
              </Block>
        </ImageBackground>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  baseText: {
          textAlign:'right',
          color :'blue',
          right:19,

  },
 
  registerContainer: {
    width: width * 0.9,
    height: height * 0.78,
    backgroundColor: "#F4F5F7",
    borderRadius: 4,
    alignSelf: 'center',
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
    overflow: "hidden"
  },
  socialConnect: {
    backgroundColor: argonTheme.COLORS.WHITE,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#8898AA"
  },
  socialButtons: {
    width: 120,
    height: 40,
    backgroundColor: "#fff",
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4

    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
    

  },
  list:{
  
  },
  socialTextButtons: {
    color: argonTheme.COLORS.PRIMARY,
    fontWeight: "800",
    fontSize: 14,
    alignSelf: 'center'
    

  },
  button: {
    width: width - theme.SIZES.BASE * 4,
    height: theme.SIZES.BASE * 3,
    shadowRadius: 0,
    shadowOpacity: 0,
    alignSelf: 'center'
   
  },
  inputIcons: {
    marginRight: 12,
    textAlign:'right',
  },
  passwordCheck: {
    paddingLeft: 100,
    paddingTop: 13,
    paddingBottom: 30,
    alignSelf: 'center'
  },
  
});

export default Register;
