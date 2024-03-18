import React, { useState } from 'react';
import { View, Text, TextInput, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';


export default function ProviderSignUpScreen() {
  var success = true;
  const [display, setDisplay] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [NPI, setNPI] = useState('');
  const [practiceCode, setPracticeCode] = useState('');

  const handleSignUp = async () => {

      if (firstName && lastName && email && password && confirmPass && NPI && practiceCode) { 
      const practice = await axios.get(`http://localhost:5000/api/practiceByCode/${practiceCode}`);

      const practiceID = practice.data._id;
      console.log(practiceID)
      /*
      if (!practiceID) {
        setDisplay('Invalid Practice ID');
        success = false;
        return;
      }
      */
      // Check password complexity
      if (password.length < 12 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
        setDisplay('Password must be at least 12 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
        success = false;
        return;
      }
      if (password == confirmPass) {
        try {
          const data = {
            firstName,
            lastName,
            email,
            password,
            NPI,
            practiceID
          }
          /*
          // Used to check if provider has a valid NPI, WIP
          //const NPIreigstryURI = `https://npiregistry.cms.hhs.gov/api/?number=${NPI}&pretty=&version=2.1`
          const NPIreigstryURI = `https://clinicaltables.nlm.nih.gov/api/npi_org/v3/search?terms=${NPI}`
          //const NPIexists = await axios.get(NPIreigstryURI);

          // Check if the email already has an associated account
          const emailNPIExists = await axios.post('http://localhost:5000/api/getProviderEmail', { email, NPI });

          if (emailNPIExists.status === 200) {
            const response = await axios.post('http://localhost:5000/api/addProvider', data);
            
            if (NPIexists.data[0] == 1) {
              const response = await axios.post('http://localhost:5000/api/addProvider', data);
            }
            else {
              setDisplay('Invalid NPI')
              success = false;
            }
            
          }
          else if (emailNPIExists.status === 201) {
            setDisplay('This email is already associated with an account!');
            success = false;
          }
          else if (emailNPIExists.status === 208) {
            setDisplay('This NPI cannot be used.');
            success = false;
          }
          */
          const response = await axios.post('http://localhost:5000/api/addProvider', data);
          console.log(response);
        }
        catch (error) {
          success = false;
          //troubleshooting signup!
          setDisplay('Error');
          console.log(error, " Error");
        }
      }
      else {
        setDisplay('Passwords do not match!');
        success = false;
      }
    }
    else {
      setDisplay('Please fill out all fields!')
      success = false;
    }
    if (success) {
      setDisplay('Account successfully created! Returning to sign in screen...');
      setTimeout(() => {
        navigation.navigate('SignIn');
      }, 1000);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AllergyAlly</Text>

      <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
        <TextInput style={styles.shortInput}
          underlineColorAndroid="transparent"
          placeholder="First Name"
          placeholderTextColor="#7a7a7a"
          value={firstName}
          autoCapitalize="none"
          onChangeText={setFirstName} />

        <TextInput style={styles.shortInput}
          underlineColorAndroid="transparent"
          placeholder="Last Name"
          placeholderTextColor="#7a7a7a"
          value={lastName}
          autoCapitalize="none"
          onChangeText={setLastName} />
      </View>

      <TextInput style={styles.input}
        underlineColorAndroid="transparent"
        placeholder="Email"
        placeholderTextColor="#7a7a7a"
        value={email}
        autoCapitalize="none"
        onChangeText={setEmail} />

      <TextInput style={styles.input}
        underlineColorAndroid="transparent"
        placeholder="National Provider Identifier"
        placeholderTextColor="#7a7a7a"
        value={NPI}
        autoCapitalize="none"
        onChangeText={setNPI} />

      <TextInput style={styles.input}
        underlineColorAndroid="transparent"
        placeholder="Practice Code"
        placeholderTextColor="#7a7a7a"
        value={practiceCode}
        autoCapitalize="none"
        onChangeText={setPracticeCode} />

      <TextInput style={styles.input}
        underlineColorAndroid="transparent"
        placeholder="Password"
        placeholderTextColor="#7a7a7a"
        value={password}
        autoCapitalize="none"
        onChangeText={setPassword}
        secureTextEntry={true} />

      <TextInput style={styles.input}
        underlineColorAndroid="transparent"
        placeholder="Confirm Password"
        placeholderTextColor="#7a7a7a"
        value={confirmPass}
        autoCapitalize="none"
        onChangeText={setConfirmPass}
        secureTextEntry={true} />


      <Text style={styles.message}>{display}</Text>
      <TouchableOpacity
        style={styles.logInButton}
        onPress={handleSignUp}>
        <Text style={styles.logInButtonText}> Create Account </Text>
      </TouchableOpacity>

    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    paddingTop: 23,
    alignItems: height > width ? null : 'center'
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1059d5',
  },
  message: {
    textAlign: 'center',
    fontSize: 12,
    color: '#DC143C',
  },
  shortInput: {
    margin: 15,
    width: height > width ? null : 136,
    flexGrow: 1,
    height: 40,
    borderColor: '#1059d5',
    borderWidth: 1,
    padding: 10
  },
  input: {
    margin: 15,
    height: 40,
    width: height > width ? null : 300,
    borderColor: '#1059d5',
    borderRadius: 0,
    borderWidth: 1,
    padding: 10
  },
  dropdown: {
    margin: 15,
    height: 40,
    width: height > width ? null : 300,
    borderColor: '#1059d5',
    borderWidth: 1,
    borderRadius: 0,
    padding: 10
  },
  dropdownSelect: {
    borderRadius: 0,
    margin: 15,
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
    justifyContent: 'center',
    borderRadius: 8,
  },
  logInButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 15,
  },
  bottomText: {
    color: '#1059d5',
    marginLeft: 15,
    marginBottom: 30,
    fontSize: 17,
    textAlign: 'center',
  },
  bottomText2: {
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
  }
})