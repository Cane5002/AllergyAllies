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

          const response = await axios.post('http://localhost:5000/api/addPractice', data);
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
        <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }} key={index}>
          <TextInput 
            style={styles.inputNPI}
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
          <TouchableOpacity
            style = {styles.removeProviderButton}
            onPress={() => setProviderNPIs((prevNPIs) => {
              const updatedNPIs = [...prevNPIs];
              updatedNPIs.splice({index}, 1);
              return updatedNPIs;
            }) }>
            <Text style = {styles.addProviderButtonText}>-</Text>
          </TouchableOpacity>
        </View>
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
    padding: 10,
    margin: 5,
    height: 20,
    width: height > width ? null : 136,
    justifyContent: 'center',
    borderRadius: 8,
  },
  addProviderButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 10,
  },
  removeProviderButton: {
    backgroundColor: '#d32d27',
    padding: 10,
    margin: 5,
    height: 40,
    width: 40,
    justifyContent: 'center',
    borderRadius: 8,
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