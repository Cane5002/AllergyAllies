import React, { useState } from 'react';
import { View, Text, TextInput, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';

export default function PatientSignUpScreen({navigation}) {
  var pracID = "";
  const [display, setDisplay] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [practiceCode, setPracticeCode] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [DoB, setDob] = useState('');
  const [phone, setPhone] = useState('');

  const isNumeric = (value) => {
    return /^[0-9]+$/.test(value);
  };

  const isValidDate = (date) => {
    return /\d{4}-\d{2}-\d{2}/.test(date);
  };

  const handleSignUp = async () => {
    var success = true;
    setDisplay('')
    if (firstName && lastName && email && phone && practiceCode && height && weight && password && confirmPass) {

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
            phone,
            height,
            weight,
            DoB,
            practiceCode
          }

          if (!isNumeric(height)) {
            setDisplay('Invalid height.');
            success = false;
            return;
          }
          if (!isNumeric(weight)) {
            setDisplay('Invalid weight.');
            success = false;
            return;
          }
          if (!isValidDate(DoB)) {
            setDisplay('Invalid date of birth.');
            success = false;
            return;
          }

          const response = await axios.post(`${process.env.EXPO_PUBLIC_BACKEND_URL}:${process.env.EXPO_PUBLIC_BACKEND_PORT}/api/addPatient`, data);
          console.log(response);

          if (response.status != 201) {
            setDisplay(response.data.message);
            success = false;
            return;
          }

        }
        catch (error) {
          success = false;
          console.log(error, " Error");
        }
      }
      else {
        setDisplay('Passwords do not match!');
        success = false;
      }
  }
  else {
    setDisplay('Please fill out all fields!');
    success = false;
  }
  if (success) {
    // Add initial blank treatment to account to be used in calculations
    // const patient = await axios.get(`http://192.168.86.25:5000/api/findPatient/${email}`)
    // const pID = patient.data._id

    // console.log(pID);
    // console.log(pracID);

    // const toAdd = {
    //   patientLastName: lastName,
    //   patientFirstName: firstName,
    //   patientID: pID,
    //   date: new Date().setHours(0,0,0,0),
    //   practiceID: pracID
    // }

    // const addingTreatment = await axios.post(`http://192.168.86.25:5000/api/addTreatment`, toAdd)



    setDisplay('Account successfully created! Returning to sign in screen...');
    setTimeout(() => {
      navigation.navigate('InitialMobileScreen');
    }, 1000);
  }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AllergyAlly</Text>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
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
        placeholder="Phone Number"
        placeholderTextColor="#7a7a7a"
        value={phone}
        autoCapitalize="none"
        onChangeText={setPhone} />

      <TextInput style={styles.input}
        underlineColorAndroid="transparent"
        placeholder="Practice Code"
        placeholderTextColor="#7a7a7a"
        value={practiceCode}
        autoCapitalize="none"
        onChangeText={setPracticeCode} />

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
        <TextInput style={styles.shortInput}
          underlineColorAndroid="transparent"
          placeholder="Height (in)"
          placeholderTextColor="#7a7a7a"
          value={height}
          autoCapitalize="none"
          onChangeText={setHeight} />

        <TextInput style={styles.shortInput}
          underlineColorAndroid="transparent"
          placeholder="Weight (lbs)"
          placeholderTextColor="#7a7a7a"
          value={weight}
          autoCapitalize="none"
          onChangeText={setWeight} />
      </View>

      <TextInput
        style={styles.input}
        underlineColorAndroid="transparent"
        placeholder="Date of Birth (YYYY-MM-DD)"
        placeholderTextColor="#7a7a7a"
        value={DoB}
        autoCapitalize="none"
        onChangeText={setDob}
      />

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
    alignItems: height > width ? null : 'center',
  },
  title: {
    marginBottom: 15,
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
    marginHorizontal: 15,
    marginVertical: 5,
    flexGrow: 1,
    height: 40,
    width: height > width ? null : 136,
    borderColor: '#1059d5',
    borderWidth: 1,
    padding: 10
  },
  input: {
    marginHorizontal: 15,
    marginVertical: 5,
    height: 40,
    width: height > width ? null : 300,
    borderColor: '#1059d5',
    borderWidth: 1,
    padding: 10
  },
  logInButton: {
    backgroundColor: '#1059d5',
    width: height > width ? null : 300,
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
  },
})