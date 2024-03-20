import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native'
import { IconButton } from 'react-native-paper';

export default function InitialScreen({navigation}){
      return (
        <View>
            <View style={{ height: 17, backgroundColor: '#063b94' }}></View>
            <ImageBackground
            source={require('./Images/initialheader.png')}
            style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', backgroundColor: '#95C8FC', }}
            resizeMode= 'fit'>
                <View>
                    <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap',}}>
                        <Text style = {styles.title}>AllergyAlly</Text>
                        <IconButton style = {{marginTop: 60}}
                        icon="flower-pollen"
                        iconColor="#063b94"
                        size={65}
                        />
                    </View>
                    <Text style = {styles.subtitle}>Manage your allergies from anywhere, at any time.</Text>
                    <Text style = {styles.description}>Keep track of appointments, calculate injection dosages, record data, and more with AllergyAlly.</Text>
                    <View style = {{flexDirection: 'row'}}>
                    <TouchableOpacity
                        style = {styles.logInButton}
                        onPress={() =>
                        navigation.navigate('ProviderSignInScreen') }>
                        <Text style = {styles.logInButtonText}>Provider Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style = {styles.createAccountButton}
                        onPress={() =>
                        navigation.navigate('ProviderSignUpScreen') }>
                        <Text style = {styles.createAccountText}>Provider Signup</Text>
                    </TouchableOpacity>

                    </View>
                    
                    <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', marginLeft: 48, marginTop: 35,}}>
                        <IconButton
                        icon="doctor"
                        iconColor="#063b94"
                        size={60}
                        />
                        <View>
                            <Text style = {styles.text}>As a Provider</Text>
                            <Text style = {styles.text2}>   • Store reports and other data</Text>
                            <Text style = {styles.text2}>   • View patient and appointment information</Text>
                            <Text style = {styles.text2}>   • Calculate injection dosages</Text>
                            <Text style = {styles.text2}>   • Get alerted of patients at risk of attrition</Text>
                        </View>
                        <View
                        style={{
                        marginLeft: 30,
                        borderLeftWidth: 2,
                        borderLeftColor: '#063b94',
                        height: 170,
                        marginBottom: 10,
                        paddingRight: 10,
                        paddingLeft: 10,
                        }}
                        />
                        <IconButton
                        icon="account-heart"
                        iconColor="#063b94"
                        size={60}
                        />
                        <View>
                            <Text style = {styles.text}>As a Patient: Download the mobile app!</Text>
                            <Text style = {styles.text2}>   • View upcoming appointment deadlines</Text>
                            <Text style = {styles.text2}>   • Keep track of treatment history</Text>
                            <Text style = {styles.text2}>   • Report reactions to treatment</Text>
                            <Text style = {styles.text2}>   • Access necessary appointment information</Text>
                        </View>
                    </View>
                    <View style={{ height: 65 }}></View>
                </View>
            </ImageBackground>
            <View style={{ height: 17, backgroundColor: '#063b94' }}></View>
        </View>
      )
   }

const styles = StyleSheet.create({
   signUpButton: {
        height: 40,
        width: 220,
        justifyContent: 'center',
        borderRadius: 8,
        marginLeft: 60,
        borderWidth: 1,
        borderColor: '#509045',
        backgroundColor: '#cee1ff'
    },
    logInButton: {
        backgroundColor: 'white',
        width: 150,
        padding: 15,
        borderRadius: 8,
        margin: 10,
        marginLeft: 60,
        shadowColor: '#041f4f',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: .3,
        shadowRadius: 3,
    },
    createAccountButton: {
       backgroundColor: '#053B94',
       width: 150,
       margin: 10,
       padding: 15,
       borderRadius: 8,
       shadowColor: '#041f4f',
       shadowOffset: { width: 0, height: 2 },
       shadowOpacity: .3,
       shadowRadius: 3,
  },
    createAccountText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 15,
        fontWeight: '600',
    },
        logInButtonText:{
            color: '#053B94',
            textAlign: 'center',
            fontSize: 15,
            fontWeight: '600',
        },
    title:{
        marginLeft: 60,
        marginTop: 60,
        color: '#063b94',
        fontSize: 60,
        fontWeight: '600',
        marginBottom: 12,
    },
    subtitle:{
        marginLeft: 60,
        marginBottom: 10,
        fontSize: 30,
        color: '#063b94',
    },
    description:{
        marginLeft: 60,
        fontSize: 16,
        fontStyle: 'italic',
        marginBottom: 18,
        color: 'white',
    },
    text:{
        fontSize: 15,
        color: '#063b94',
        marginTop: 12,
        fontWeight: 'bold',
    },
    text2:{
        fontSize: 15,
        color: '#063b94',
        marginTop: 12,
    },
})