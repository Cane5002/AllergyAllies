import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import AuthContext from '../AuthContext';

export default function SignInScreen({navigation}) {
  const { signIn } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
    if (email && password) {
      signIn(email, password); // Authenticate the user
    } else {
      // Handle validation error
    }
  };

  return (
    <AuthContext.Provider>
    <View style = {styles.container}>
    <Text style = {styles.title}>Allergy Ally</Text>
       <TextInput style = {styles.input}
               underlineColorAndroid = "transparent"
               placeholder = "Email"
               value = {email}
               autoCapitalize = "none"
               onChangeText = {setEmail}/>
            
            <TextInput style = {styles.input}
               underlineColorAndroid = "transparent"
               placeholder = "Password"
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
                  navigation.navigate('PatientSignUpScreen') }>
               <Text style = {styles.logInButtonText}>I am a patient</Text>
            </TouchableOpacity>
            <TouchableOpacity
               style = {styles.signUpButton}>
               <Text style = {styles.logInButtonText}>I am a practice</Text>
            </TouchableOpacity>
            </View>
    </View>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
     paddingTop: 23
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
     borderColor: '#1059d5',
     borderWidth: 1,
     padding: 10
  },
  logInButton: {
     backgroundColor: '#1059d5',
     padding: 10,
     margin: 15,
     height: 40,
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
     backgroundColor: '#1059d5',
     padding: 10,
     margin: 10,
     height: 40,
     width: 150,
     justifyContent: 'center',
     borderRadius: 8,
  },
})