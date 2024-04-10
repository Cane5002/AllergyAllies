import React, { useState } from 'react';
import { View, Text, TextInput, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';

export default function PracticeEnrollment() {
  var success = true;
  const [display, setDisplay] = useState('');
  const [practiceName, setName] = useState('');
  const [providerCount, setProviderCount] = useState(1);
  const [providerNPIs, setProviderNPIs] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [officeHours, setOfficeHours] = useState('');
  const [allergyShotHours, setAllergyShotHours] = useState('');
  const [practiceCode, setPracticeCode] = useState('');

  const handleEnrollment = async () => {

    setDisplay('')
    if (practiceName && providerNPIs && phoneNumber && address && email && officeHours && allergyShotHours && practiceCode) {
        try {
          console.log(providerNPIs);
          for (let npi of providerNPIs) {
            if (isNaN(parseInt(npi))) {
              setDisplay(`Povider NPI ${npi} must be a number`);
              success = false;
              return;
            }
            if (npi.length != 10) {
              setDisplay(`Povider NPI ${npi} must be 10 digits`);
              success = false;
              return;
            }
          }

          const data = {
            practiceName,
            providerNPIs,
            phoneNumber,
            address,
            email,
            officeHours,
            allergyShotHours,
            practiceCode
          }
          

          const practiceExists = await axios.get(`http://localhost:5000/api/practiceByName/${practiceName}`);
          console.log(practiceExists.status);

          if (practiceExists.status === 200) {
            setDisplay('This practice is already enrolled!');
            success = false;
            return;
          }

          practiceExists = await axios.get(`http://localhost:5000/api/practiceByCode/${practiceCode}`);
          console.log(practiceExists.status);

          if (practiceExists.status === 200) {
            setDisplay('This Practice Code is already in use!');
            success = false;
            return;
          }

          const response = await axios.post('http://localhost:5000/api/addPractice', data);
          console.log(response);
        }
        catch (error) {
          success = false;
          console.log(error, " Error");
        }
    }
    else {
      setDisplay('Please fill out all fields!');
      success = false;
    }
    if (success) {
      setDisplay('Practice successfully enrolled!');
      setTimeout(() => {
        navigation.navigate('ProviderSignUpScreen');
        }, 1000);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Allergy Ally</Text>

      <TextInput style={styles.input}
        underlineColorAndroid="transparent"
        placeholder="Practice Name"
        placeholderTextColor="#7a7a7a"
        value={practiceName}
        autoCapitalize="none"
        onChangeText={setName} />

      <Text style={styles.subHeading}>Provider NPI's</Text>
      {providerNPIs.map((npi, index) => (
        <TextInput style={styles.inputNPI}
          key = {index}
          underlineColorAndroid="transparent"
          placeholder="Provider NPI"
          placeholderTextColor="#7a7a7a"
          value={npi}
          autoCapitalize="none"
          onChangeText={(text) => setProviderNPIs((prevNPIs) => {
              const updatedNPIs = [...prevNPIs];
              updatedNPIs[index] = text;
              return updatedNPIs;
        })} />
      ))}
      <TouchableOpacity
        style = {styles.addProviderButton}
        onPress={() => setProviderNPIs((prevNPIs) => {
          return [...prevNPIs, ''];
        }) }>
        <Text style = {styles.addProviderButtonText}>Add Provider</Text>
      </TouchableOpacity>
      {/* <TextInput style={styles.input}
        underlineColorAndroid="transparent"
        placeholder="Provider NPI"
        placeholderTextColor="#7a7a7a"
        value={providerNPIs}
        autoCapitalize="none"
        onChangeText={setProviderNPIs} /> */}

      <TextInput style={styles.input}
        underlineColorAndroid="transparent"
        placeholder="Address"
        placeholderTextColor="#7a7a7a"
        value={address}
        autoCapitalize="none"
        onChangeText={setAddress} />

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
        value={phoneNumber}
        autoCapitalize="none"
        onChangeText={setPhoneNumber}/>

      <TextInput style={styles.input}
        underlineColorAndroid="transparent"
        placeholder="Office Hours"
        placeholderTextColor="#7a7a7a"
        value={officeHours}
        autoCapitalize="none"
        onChangeText={setOfficeHours} />

      <TextInput style={styles.input}
        underlineColorAndroid="transparent"
        placeholder="Allergy Shot Hours"
        placeholderTextColor="#7a7a7a"
        value={allergyShotHours}
        autoCapitalize="none"
        onChangeText={setAllergyShotHours} />

    <TextInput style={styles.input}
        underlineColorAndroid="transparent"
        placeholder="Practice Code used for Patient Enrollment"
        placeholderTextColor="#7a7a7a"
        value={practiceCode}
        autoCapitalize="none"
        onChangeText={setPracticeCode} />

      <Text style={styles.message}>{display}</Text>
      <TouchableOpacity
        style={styles.logInButton}
        onPress={handleEnrollment}>
        <Text style={styles.logInButtonText}> Enroll Practice </Text>
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
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1059d5',
  },
  subHeading: {
    textAlign: 'left',
    fontSize: 15,
    color: '#1059d5',
  },
  message: {
    textAlign: 'center',
    fontSize: 12,
    color: '#000000'
},
  shortInput: {
    margin: 15,
    flexGrow: 1,
    height: 40,
    width: height > width ? null : 136,
    borderColor: '#1059d5',
    borderWidth: 1,
    padding: 10
  },
  input: {
    margin: 15,
    height: 40,
    width: height > width ? null : 300,
    borderColor: '#1059d5',
    borderWidth: 1,
    padding: 10
  },
  inputNPI: {
    margin: 5,
    height: 40,
    width: height > width ? null : 136,
    borderColor: '#1059d5',
    borderWidth: 1,
    padding: 10
  },
  addProviderButton: {
    backgroundColor: '#1059d5',
    width: height > width ? null : 136,
    padding: 10,
    margin: 5,
    height: 20,
    justifyContent: 'center',
    borderRadius: 8,
  },
  addProviderButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 10,
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