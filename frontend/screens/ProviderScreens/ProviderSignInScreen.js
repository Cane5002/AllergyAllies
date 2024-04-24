import React, { useContext, useState } from 'react';
import { Dimensions, View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import AuthContext from '../../AuthContext';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function ProviderSignInScreen({navigation}) {
  const { signIn } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    if (email && password) {
      try {
         const authData = {
            email,
            password
         };
         
         // this needs to have your ip address for android (probably iOS too). 
         // get ip quickly from "Metro waiting on exp://<ip>:port"
         // for desktop it should be 'http://localhost:5000/auth/'
         const response = await axios.post(`${process.env.APP_MANIFEST.database.IP}:${process.env.APP_MANIFEST.database.Port}/auth/provider`, authData);
         console.log(response);
         // response successful
         if (response.status === 200) {
            const userToken = response.data.accessToken;
            const decodedToken = jwt_decode(userToken);
  
            await AsyncStorage.setItem('userToken', userToken);
            // data from token
            const userID = decodedToken.UserInfo;
            console.log(userID)
            signIn(userToken);
         } else {
            console.log("Error with response ", response.status);
         }

      } catch (error) {
         console.log(error, " Error"); 
      }
    } 
  };

  return (
    <View style = {styles.container}>
    <Text style = {styles.title}>Allergy Ally</Text>
       <TextInput style = {styles.input}
               underlineColorAndroid = "transparent"
               placeholder = "Email"
               placeholderTextColor="#7a7a7a"
               value = {email}
               autoCapitalize = "none"
               onChangeText = {setEmail}/>
            
            <TextInput style = {styles.input}
               underlineColorAndroid = "transparent"
               placeholder = "Password"
               placeholderTextColor="#7a7a7a"
               value = {password}
               autoCapitalize = "none"
               onChangeText = {setPassword}
               secureTextEntry={true}/>

            <TouchableOpacity
               style = {styles.logInButton}
               onPress={handleSignIn}>
               <Text style = {styles.logInButtonText}> Log In </Text>
            </TouchableOpacity>

      <Text style = {styles.bottomText2}>Don't have an account yet?</Text>
            <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
            <TouchableOpacity
               style = {styles.signUpButton}
               onPress={() =>
                  navigation.navigate('ProviderSignUpScreen') }>
               <Text style = {styles.signUpButtonText}>Sign Up</Text>
            </TouchableOpacity>
            </View>
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
     paddingTop: 23, 
     alignItems: height > width ? null : 'center',
     justifyContent: height > width ? null : 'center',
     flex: 1
  },
  title :{
     textAlign: 'center',
     fontSize: 20,
     fontWeight: 'bold',
     color: '#1059d5',
  },
  input: {
     margin: 15,
     height: 40,
     width: height > width ? null : 300,
     borderColor: '#1059d5',
     borderWidth: 1,
     padding: 10
  },
  logInButton: {
     backgroundColor: '#1059d5',
     padding: 10,
     margin: 15,
     height: 40,
     width: height > width ? null : 300,
     justifyContent: 'center',
     borderRadius: 8,
  },
  logInButtonText:{
     color: 'white',
     textAlign: 'center',
     fontSize: 15,
  },
  bottomText:{
     color: '#1059d5',
     marginLeft: 15,
     marginBottom: 30,
     fontSize: 17,
     textAlign: 'center',
  },
  bottomText2:{
     color: '#606060',
     marginLeft: 15,
     fontSize: 17,
     textAlign: 'center',
     fontWeight: '600'
  },
  signUpButton: {
     padding: 10,
     margin: 10,
     height: 40,
     width: 150,
     justifyContent: 'center',
     borderRadius: 8,
     borderColor: '#1059d5',
     borderWidth: 1
  },
  signUpButtonText:{
   color: '#1059d5',
   textAlign: 'center',
   fontSize: 15,
},
})
