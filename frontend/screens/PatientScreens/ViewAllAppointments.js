import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native'
import User from '../../User.js';
import axios from 'axios';

export default function ViewAllAppointments({navigation}){


    //repeated code from PatientProgress screen, could condense into one file used by both

    const userInfo = User();
    const email = userInfo.email;

    const [patient, setPatient] = useState();
    const [treatments, setTreatments] = useState();
    const [loading, setLoading] = useState(true);

    //function that takes in a date from MongoDB and converts it into readable format
    function formatDateWithDay(mongoDate){

      const javascriptDate = new Date(mongoDate);
      const utcDate = new Date(javascriptDate.getTime() + javascriptDate.getTimezoneOffset() * 60 * 1000);
  
      return utcDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          });
  
      }

   //get the list of treatments associated with patient
   useEffect(() => {

    const findPatient = async () => {
      if (email){
        //replace with your IP address, find quickly from "Metro waiting on exp://<ip>:port" under QR code
        const patientObj = await axios.get(`${process.env.APP_MANIFEST.database.IP}:${process.env.APP_MANIFEST.database.Port}/api/findPatient/${email}`)
        setPatient(patientObj.data)
      }
    }
    if (!patient) { findPatient(); }

    const findTreatments = async () => {
      //replace with your IP address, find quickly from "Metro waiting on exp://<ip>:port" under QR code
      const treatmentsObj = await axios.get(`${process.env.APP_MANIFEST.database.IP}:${process.env.APP_MANIFEST.database.Port}/api/getAllTreatmentsByID/${patient._id}`)
      //sort treatments by date
      const sortedTreatments = treatmentsObj.data.slice().sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
      });

      // only return appointments attended / not future appointment deadline
      const attendedTreatments = sortedTreatments.filter(treatment => treatment.attended === true);
      setTreatments(attendedTreatments)
    }
    if (!treatments && patient) { findTreatments(); }

    if (patient && treatments) { setLoading(false) }

  })

  if (loading) {
    return <Text>Loading...</Text>
   }


     //create Past Injection blocks for list at bottom of screen
     //date is from backend but Attended on Time flag is still hardcoded
     const PastInjectionBlock = ({ treatment }) => (
        <TouchableOpacity
          onPress={() => navigation.navigate('InjectionInfo', {bottlesParam: treatment.bottles, dateParam: formatDateWithDay(treatment.date)})}
          style={styles.pastAppointment}>
            <Text style={styles.pastAppointmentText}>{formatDateWithDay(treatment.date)}</Text>
            <View style={styles.flags}>
                <View style={styles.onTime}>
                <Text style={{color: 'white'}}> Attended on Time</Text>
                </View>
            </View>
        </TouchableOpacity>
      );

   return (
    <ScrollView style = {styles.container}>

             
     <Text style = {styles.title2}>Past Injections </Text>

    
         {treatments.map((treatment, index) => (
          <PastInjectionBlock key={index} treatment={treatment}/>
         ))}
      
      <View style={{marginBottom: 80}}></View>
 
    </ScrollView>
   )
}



const styles = StyleSheet.create({
    container: {
       paddingTop: 20,
    },

     title2 :{
         fontSize: 20,
         fontWeight: 'bold',
         color: '#424242',
         marginBottom: 4,
         alignSelf: 'center'
     },
    
     appointment: {
         width: Dimensions.get('window').width - 30,
         marginLeft: 15,
         marginBottom: 8,
         height: 60,
         borderRadius: 8,
         backgroundColor: '#84aef8',
         justifyContent: 'center',
         paddingHorizontal: 20,
         textstyle:{fontsize: 60}
     },
 
     pastAppointmentText: {
         fontSize: 17,
         marginBottom: 4,
         fontWeight: '500',
         marginTop: 12,
     },
     pastAppointment: {
         margin: 10,
         marginHorizontal: 22,
         marginBottom: 10,
         borderRadius: 12,
         backgroundColor: '#d1ddf2',
         paddingLeft: 20,
         paddingBottom: 8,
         textstyle:{fontsize: 60},
         shadowColor: 'black',
         shadowOffset: { width: 0, height: 2 },
         shadowOpacity: 0.3,
         shadowRadius: 2,
     },
     
     flags: {
         flex: 1,
         flexDirection: 'row',
         flexWrap: 'wrap',
         alignItems: 'center',
         borderRadius: 20,
     },
     onTime: {
         borderRadius: 8, 
         backgroundColor: '#5ba863',
         padding: 2,
         paddingHorizontal: 4,
         marginRight: 6,
         marginBottom: 6
     },
     adverseReaction: {
         borderRadius: 8, 
         backgroundColor: '#e55555',
         padding: 2,
         paddingHorizontal: 4,
         marginRight: 6,
         marginBottom: 6
     },
     attendedLate: {
         borderRadius: 8, 
         backgroundColor: '#ff955c',
         padding: 2,
         paddingHorizontal: 4,
         marginRight: 6,
         marginBottom: 6
     },
     flagText: {
         backgroundColor: 'red',
         color: 'white',
     }
 })
 
 
 
 
 