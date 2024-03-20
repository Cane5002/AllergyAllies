import React, { useContext, useState, useEffect } from 'react'
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import AuthContext from '../../AuthContext.js';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons/faPenToSquare'
import User from '../../User';
import axios from 'axios';



export default function PatientProfile({navigation}) {

  const { signOut } = useContext(AuthContext);
  const userInfo = User();
  const firstName = userInfo.firstName;
  const lastName = userInfo.lastName;
  const email = userInfo.email;

  const [patient, setPatient] = useState();
  const [protocol, setProtocol] = useState();
  const [practice, setPractice] = useState();
  const [firstTreatment, setFirstTreatment] = useState();
  const [loading, setLoading] = useState(true);

  // Get the current bottles for this patient's practice
  useEffect(() => {

    const findPatient = async () => {
      if (email){
        //replace with your IP address, find quickly from "Metro waiting on exp://<ip>:port" under QR code
        const patientObj = await axios.get(`http://192.168.86.25:5000/api/findPatient/${email}`)
        setPatient(patientObj.data)
      }
    }
    if (!patient) { console.log("can't find patient"); findPatient(); }

    const findPractice = async () => {
      //replace with your IP address, find quickly from "Metro waiting on exp://<ip>:port" under QR code
      const practiceObj = await axios.get(`http://192.168.86.25:5000/api/practice/${patient.practiceID}`)
      setPractice(practiceObj.data)
    }
    if (!practice && patient) { findPractice(); }

    const findProtocol = async () => {
      //replace with your IP address, find quickly from "Metro waiting on exp://<ip>:port" under QR code
      const protocolObj = await axios.get(`http://192.168.86.25:5000/api/getProtocol/${patient.practiceID}`)
      setProtocol(protocolObj.data.protocol)
    }
    if (!protocol && patient) { findProtocol(); }

    if (practice && patient && protocol) { setLoading(false) }

  })

  if (loading) {
   return <View>
    <Text>Loading...</Text>
     <TouchableOpacity
      style={styles.signOutButton}
      onPress={signOut}>
      <Text style={styles.signOutButtonText}> Sign Out </Text>
    </TouchableOpacity>
    </View>
   
  }

  const PatientInfoGeneral = () => (
    <View style={styles.profilePhotoContainer}>
      <Image
        source={require('../Images/profilepic.png')}
        style={styles.profilePhoto}
      />
      <Text style={styles.name}>{firstName} {lastName}</Text>
      <Text style={styles.grayText}> {patient.email} </Text>
    </View>
  )

  const CurrentMedications = () => (
    <View style={styles.textBoxContainer}>


      <View style = {{flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#e3e3e3', marginHorizontal: 9, paddingRight: 12}}>
        <Text style={styles.textBoxTitle}>Current Allergy Medications                                                                                       </Text>
  
        <TouchableOpacity style = {{}}
        onPress={() => navigation.navigate('EditCurrentMedications')}>
        <FontAwesomeIcon icon={faPenToSquare} color={'#0d3375'} size={20}/> 
        </TouchableOpacity>
      
      </View>

      

      {/* HARDCODED NEEDS TO BE FIXED, grab values from EditCurrentMedications screen */}
      <Text style={styles.textBoxContent}>Nasal Steroid Spray </Text>
      <Text style={styles.textBoxContent}>Nasal Antihistamine Spray </Text>
      <Text style={styles.textBoxContent}>Oral Antihistamine </Text>
      <Text style={styles.textBoxContent}>Other </Text>
    </View>
  )

  const MedicalPractice = () => (
    <View style={styles.textBoxContainer}>
      <View style={styles.textBoxDivider}>
        <Text style={styles.textBoxTitle}>Medical Practice                                                                                                               </Text>
      </View>
      <Text style={styles.textBoxContent}>{practice.practiceName} </Text>
    </View>
  )

  const TreatmentInformation = () => (
    <View style={styles.textBoxContainer}>
      <View style={styles.textBoxDivider}>
        <Text style={styles.textBoxTitle}>Treatment Information                                                                                                               </Text>
      </View>
      <Text style={styles.textBoxContent}>Treatment Start Date:</Text>
      <Text style={styles.textBoxSubContent}>10/17/23</Text>
      <Text style={styles.textBoxContent}>Tracking Start Date:</Text>
      <Text style={styles.textBoxSubContent}>10/17/23</Text>

      <Text style={styles.textBoxContent}>Frequency of Injections:</Text>
      <Text style={styles.textBoxSubContent}>2x a week</Text>
    </View>
  )

  const SignOut = () => (
    <TouchableOpacity
      style={styles.signOutButton}
      onPress={signOut}>
      <Text style={styles.signOutButtonText}> Sign Out </Text>
    </TouchableOpacity>
  )


  return (
    <ScrollView style={styles.container}>
      <PatientInfoGeneral />
      <CurrentMedications />
      <MedicalPractice />
      <TreatmentInformation />
      <SignOut />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  textBoxContainer: {
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: 'white',
    marginTop: 18,
    marginBottom: 18,
    paddingBottom: 6

  },
  textBoxTitle: {
    fontSize: 16,
    marginTop: 8,
    alignSelf: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#e3e3e3',
    paddingLeft: 15,
    paddingBottom: 6,
    color: '#0d3375',
    fontWeight: '600'
  },
  textBoxDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#e3e3e3',
  },
  textBoxContent: {
    fontSize: 16,
    marginTop: 8,
    textAlign: 'left',
    alignSelf: 'flex-start',
    paddingLeft: 15,
    paddingBottom: 8,
    color: '#5e5e5e',
    fontWeight: '400'
  },
  textBoxSubContent: {
    fontSize: 16,
    marginTop: -2,
    textAlign: 'left',
    alignSelf: 'flex-start',
    paddingLeft: 15,
    paddingBottom: 6,
    color: '#878787',
    fontWeight: '400'
  },
  profilePhotoContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  label: {
    fontSize: 16,
    fontWeight: 'light',
    marginTop: 22,
    marginHorizontal: 4,
  },
  text: {
    fontSize: 16,
    marginTop: 8,

  },
  name: {
    fontSize: 20,
    marginTop: 8,
    fontWeight: '700'
  },
  grayText: {
    fontSize: 14,
    marginTop: 2,
    marginBottom: 15,
    color: '#757575'
  },
  signOutButton: {
    backgroundColor: '#ffe3e7',
    padding: 5,
    marginTop: 30,
    marginHorizontal: 50,
    height: 40,
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ff6177',
    marginBottom: 40
  },
  signOutButtonText: {
    color: '#ff6177',
    textAlign: 'center',
    fontSize: 15,
  },
  tableHeader: {
    backgroundColor: '#DCDCDC',
  }
});