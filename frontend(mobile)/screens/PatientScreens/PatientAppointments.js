

import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Platform } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import User from '../../User';
import axios from 'axios';

//PATIENT HOME SCREEN

const Tab = createBottomTabNavigator();

export default function PatientAppointments({navigation}){

    const userInfo = User();
    const email = userInfo.email;
    const firstName = userInfo.firstName;


    const [patient, setPatient] = useState();
    const [treatments, setTreatments] = useState();
    const [loading, setLoading] = useState(true);
    const [futureAppointmentDeadline, setFutureAppointmentDeadline] = useState(null);
    const [daysUntilDeadline, setDaysUntilDeadline] = useState(0);
    const [deadlineOverdue, setDeadlineOverdue] = useState(false)

    //function that takes in a date from MongoDB and converts it into readable format
    //includes day of week
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


          
  useEffect(() => {

    const findPatient = async () => {
      if (email){
        //replace with your IP address, find quickly from "Metro waiting on exp://<ip>:port" under QR code
        const patientObj = await axios.get(`http://192.168.86.25:5000/api/findPatient/${email}`)
        setPatient(patientObj.data)
      }
    }
    if (!patient) {console.log("Patient home screen can't find patient"); findPatient(); }

    //get the list of treatments associated with patient
    const findTreatments = async () => {
        //replace with your IP address, find quickly from "Metro waiting on exp://<ip>:port" under QR code
        const treatmentsObj = await axios.get(`http://192.168.86.25:5000/api/getAllTreatmentsByID/${patient._id}`)
        

        //sort treatments by date
        const sortedTreatments = treatmentsObj.data.slice().sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateB - dateA;
        });
  
        // only return appointments attended, not appointment deadline
        const attendedTreatments = sortedTreatments.filter(treatment => treatment.attended === true);
        setTreatments(attendedTreatments)

        //get appointment deadline
        const treatmentNotAttended = treatmentsObj.data.filter(treatment => treatment.attended === false);
          if (treatmentNotAttended.length === 1) {
          //set appointment deadline
          setFutureAppointmentDeadline(formatDateWithDay(treatmentNotAttended[0].date));
          console.log('Date of future appointment:', futureAppointmentDeadline);

          //get days until appointment deadline
          const today = new Date(); // current date
          const todayUtc = new Date(today.getTime() + today.getTimezoneOffset() * 60 * 1000);
          const appointmentDeadline = new Date(treatmentNotAttended[0].date);
          const deadlineUtc = new Date(appointmentDeadline.getTime() + appointmentDeadline.getTimezoneOffset() * 60 * 1000);
          
          // set both dates to the same time (midnight) to ensure accurate day calculation (might still have issue at certain times of day)
          deadlineUtc.setUTCHours(0, 0, 0, 0);
          todayUtc.setUTCHours(0, 0, 0, 0);
          console.log('Deadline:', deadlineUtc)
          console.log('Current date:', todayUtc)

          // Calculate the difference in milliseconds between today and the appointment deadline
          const timeDifference = deadlineUtc.getTime() - todayUtc.getTime();
          console.log(timeDifference)

          if (timeDifference < 0) {
            //deadline overdue
            setDaysUntilDeadline(Math.ceil(-timeDifference / (1000 * 3600 * 24)));
            setDeadlineOverdue(true); 
          }
            else {
            //deadline in future or today
            setDaysUntilDeadline(Math.ceil(timeDifference / (1000 * 3600 * 24)));
          }
        

        } else if (treatmentNotAttended.length > 1) {
          setFutureAppointmentDeadline("More than one future appointment found")
          throw new Error('More than one not attended appointment found.');
        } else {
          setFutureAppointmentDeadline("No appointment deadline found!")
          console.log('No appointments with attended = false found.');
        }
      
      

      }

    if (!treatments && patient) { findTreatments(); }

    if (patient && treatments) { setLoading(false) }


    

  })

  if (loading) {
    return <Text>Loading...</Text>
   }
  
   //the days until deadline feature crashed the web version of the app, put this here so it doesn't crash
   if (Platform.OS === 'web')
   {
    return <Text>Web version of mobile app</Text>
   }

   //get compliance rate
    var msg = "";
    if (patient.missedAppointmentCount){
        //appointments attended on time over total appointments
        var compliance = ((treatments.length - patient.missedAppointmentCount)/treatments.length * 100).toFixed(1);
        if (compliance >= 80)
        msg = "Great job!";
      else if (compliance >= 60)
        msg = "Keep it up!";
      else
        msg = "Talk to your doctor about ways you can improve.";
    }    
    else {
        var compliance  = "-"
        msg = "No compliance rate available yet."   
    }

    
    //get text for appointment deadline information
    var deadlineMsg = "";
    var deadlineMsg2 = "";
    var deadlineMsg3 = "";
    if (deadlineOverdue) {
      //appointment deadline overdue
      deadlineMsg = `Appointment deadline was`;
      deadlineMsg2 = `${daysUntilDeadline} day${daysUntilDeadline !== 1 ? 's' : ''} ago`
      deadlineMsg3 = 'Come in as soon as \n possible!'
      deadlineTextStyle = styles.overdue;
    } else {
      //appointment deadline in future
      deadlineMsg = `Appointment deadline in`;
      deadlineMsg2 = `${daysUntilDeadline} day${daysUntilDeadline !== 1 ? 's' : ''}`
      deadlineTextStyle = styles.days;
    }

      return (
        <ScrollView style = {styles.container}>
        <Text style = {styles.welcome}>Welcome, {firstName}</Text>
        <View style = {styles.card}>
        <Text style = {styles.title1}>You have been</Text>
        <Text style = {styles.complianceNum}>{compliance}%</Text>
        
        <Text style = {styles.title1}>compliant with your treatment schedule.</Text>
        <Text style = {styles.message}>{msg}</Text> 
        </View>

        <TouchableOpacity style = {styles.card2} onPress={() =>
    navigation.navigate('Upcoming')
  }>
        <Text style = {styles.subtext}>{deadlineMsg}</Text>
        <Text style = {deadlineTextStyle}>{deadlineMsg2}</Text>
        <Text style = {styles.subDays}>{futureAppointmentDeadline}</Text>
        <Text style = {styles.overdueSubtext}>{deadlineMsg3}</Text>
        </TouchableOpacity>

        <Image style={{ width: "150%", height: "20%", marginTop: 10, marginLeft: -85, marginBottom: 150}} source={require('../Images/AdPlaceholder.png')} />

    </ScrollView>

      )
   }

   const styles = StyleSheet.create({
    container: {
     flex: 1,
     padding: 16,
    },
    card: {
     alignItems: 'center',
     borderRadius: 8,
     backgroundColor: 'white',
     marginTop: 18,
     marginBottom: 30,
     padding: 12,
    },
    card2: {
      alignItems: 'center',
      borderRadius: 160,
      height: 320,
      width: 320,
      alignSelf: 'center',
      justifyContent: 'center',
      backgroundColor: '#0d3375',
      marginTop: 2,
      marginBottom: 30,
      padding: 12,
     },
    welcome :{
     fontSize: 20,
     fontWeight: '600',
     alignSelf: 'center',
     color: '#0d3375'
     },
    title1: {
     marginHorizontal: 8,
     marginVertical: 5,
     textAlign: 'center',
     fontSize: 18,
     fontWeight: '400',
     fontStyle: 'italic',
     color: '#3d3d3d'
     },
    subtext: {
      marginHorizontal: 8,
      marginTop: 40,
      marginBottom: 5,
      textAlign: 'center',
      fontSize: 18,
      fontWeight: '400',
      fontStyle: 'italic',
      color: 'white'
      },
     overdueSubtext: {
        marginHorizontal: 8,
        marginVertical: 5,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '400',
        fontStyle: 'italic',
        color: '#ff7661'
        },
     message: {
         marginHorizontal: 8,
         marginVertical: 5,
         textAlign: 'center',
         fontSize: 18,
         fontWeight: '600',
         color: '#539CF5'
         },
     complianceNum: {
         textAlign: 'center',
         fontSize: 32,
         fontWeight: '600',
         color: '#539CF5',
         margin: 10
     },
     days: {
      textAlign: 'center',
      fontSize: 32,
      fontWeight: '600',
      color: 'white',
      marginBottom: 10
      },
    overdue: {
    textAlign: 'center',
    fontSize: 32,
    fontWeight: '600',
    color: '#ff7661',
    marginBottom: 10
    },
    subDays: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: '#688ab3',
    marginBottom: 10
    }
 })


