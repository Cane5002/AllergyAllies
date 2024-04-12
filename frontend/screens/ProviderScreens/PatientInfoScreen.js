import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const PatientInfoScreen = ({ navigation }) => {
  const [Fname, setFName] = useState('');
  const [Lname, setLName] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [email, setEmail] = useState('');
  const [practiceID,setPracticeID ] = useState('');
  const [phone,setPhone ] = useState('');
  const [DoB,setDoB ] = useState('');
  const [height,setHeight ] = useState('');

  const handleProceed = () => {
    navigation.navigate('FirstScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Patient Information</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Enter First Name"
          value={Fname}
          onChangeText={setFName}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Last Name"
          value={Lname}
          onChangeText={setLName}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Age"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Weight"
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Height"
          value={height}
          onChangeText={setHeight}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Date of Birth"
          value={DoB}
          onChangeText={setDoB}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Phone Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Practice ID"
          value={practiceID}
          onChangeText={setPracticeID}
          keyboardType="numeric"
        />
      </View>
      <TouchableOpacity style={styles.proceedButton} onPress={handleProceed}>
        <Text style={styles.proceedButtonText}>Proceed to SNOT Survey</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#063b94',
    marginBottom: 20,
  },
  form: {
    width: '80%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  proceedButton: {
    backgroundColor: '#063b94',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
  },
  proceedButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default PatientInfoScreen;
