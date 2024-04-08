import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { IconButton } from 'react-native-paper';

export default function InitialMobileScreen({navigation}){
      return (

<View style={styles.container}>
      <View style={styles.content}>
      <IconButton
                        icon="flower-pollen"
                        iconColor="white"
                        size={60}
                        style={{marginTop: -40}}
                        />
        <Text style={styles.appName}>AllergyAlly</Text>
        <Text style={styles.description}>
          Manage your allergies from anywhere, at any time.
        </Text>
      </View>
      <View style={styles.buttonContainer}>
      <TouchableOpacity
      style = {styles.logInButton}
      onPress={() =>
      navigation.navigate('PatientSignIn') }>
      <Text style = {styles.logInButtonText}>Patient Login</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style = {styles.createAccountButton}
      onPress={() =>
      navigation.navigate('PatientSignUpScreen') }>
      <Text style = {styles.createAccountText}>Patient Signup</Text>
    </TouchableOpacity>
      </View>
    </View>
      )
   }

   const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1059d5', // Blue background color
      },
      appName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
      },
      description: {
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
        marginHorizontal: 20,
        marginBottom: 20,
      },
    logInButton: {
        //justifyContent: 'center',
        backgroundColor: 'white',
        padding: 15,
        paddingHorizontal: 60,
        borderRadius: 8,
        margin: 4,
        shadowColor: '#041f4f',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: .3,
        shadowRadius: 3,
    },
    createAccountButton: {
      //justifyContent: 'center',
      //backgroundColor: '#1059d5',
      borderColor: 'white',
      borderWidth: 1,
      padding: 15,
      paddingHorizontal: 60,
      borderRadius: 8,
      margin: 4,
      marginTop: 10,
  },
  createAccountText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
},
    logInButtonText:{
        color: '#1059d5',
        textAlign: 'center',
        fontSize: 15,
        fontWeight: '600',
    },
    content: {
        marginTop: 100,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      buttonContainer: {
        marginBottom: 50
      },
  });