import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Card, IconButton } from 'react-native-paper';
import AuthContext from '../../AuthContext';
import User from '../../User';
import { fetchRecentAlerts, alertMessage, formatDate } from '../../utils/alertUtils';

export default function Portal({navigation}){

   const { signOut } = useContext(AuthContext);
   const userInfo = User();
   const role = userInfo.role;
   const firstName = userInfo.firstName;

   const [recentAlerts, setRecentAlerts] = useState([]);

   useEffect(() => {
      const fetchAlerts = async () => {
         const alerts = await fetchRecentAlerts(userInfo.id);
         setRecentAlerts(alerts);
      }

      fetchAlerts();
   }, []);


   return (
      // PATIENT PORTAL
      <View style = {styles.container}>
      <Text style={styles.header}>Welcome, {firstName}</Text>
      <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', paddingTop: 22}}>
      <TouchableOpacity style={styles.menuItem}
         onPress={() =>
            navigation.navigate('PatientHome')
         }>
            <Text style={styles.menuItemText}>Appointments</Text>
            <IconButton
               icon="calendar-month"
               iconColor="#1059d5"
               size={30}
               alignItems='center'
            />
         </TouchableOpacity> 
         <TouchableOpacity style={styles.menuItem}
         onPress={() =>
            navigation.navigate('Alerts')
         }>
            <Text style={styles.menuItemText}>Alerts</Text>
            <IconButton
               icon="alert"
               iconColor="#1059d5"
               size={30}
               alignItems='center'
            />
         </TouchableOpacity>
         <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Report a Reaction</Text>
            <IconButton
               icon="exclamation-thick"
               iconColor="#1059d5"
               size={30}
               alignItems='center'
            />
         </TouchableOpacity> 
         <TouchableOpacity style={styles.menuItem}onPress={() =>
            navigation.navigate('PracticeSurvey')
         }>
            <Text style={styles.menuItemText}>Edit Survey Responses</Text>
            <IconButton
               icon="pencil"
               iconColor="#1059d5"
               size={30}
               alignItems='center'
            />
         </TouchableOpacity>
         <TouchableOpacity style={styles.menuItem}
         onPress={() =>
            signOut()
         }>
            <Text style={styles.menuItemText}>Sign Out</Text>
            <IconButton
               icon="exit-to-app"
               iconColor="#1059d5"
               size={30}
               alignItems='center'
            />
         </TouchableOpacity> 
      </View>
      </View>
   )
}

const styles = StyleSheet.create({
   header:{
      color: '#606060',
      marginBottom: 15,
      fontSize: 25,
      textAlign: 'center',
      fontWeight: '600',
      marginTop: 10,
   },
   header2:{
      marginBottom: 20,
      fontSize: 50,
      fontWeight: '600',
      marginTop: 20,
      marginLeft: 100,
      color: '#1059d5',
   },
   container: {
      paddingTop: 23
   },
   container2: {
      paddingTop: 23,
      backgroundColor: 'white'
   },
   menuItem: {
      padding: 10,
      margin: 15,
      height: 150,
      width: 150,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 8,
      borderWidth: 3,
      backgroundColor: '#d1ddf2',
      borderColor: '#1059d5',
   },
   menuItemText:{
      color: '#1059d5',
      textAlign: 'center',
      fontSize: 20,
      fontWeight: '600',
   },
   providerDashboardItem:{
      borderRadius: 20,
      height: 150,
      width: 200,
      marginBottom: 30,
      alignItems: 'center'
   },
   providerDashboardText:{
      color: 'white',
      textAlign: 'center',
      fontSize: 20,
      fontWeight: '600',
      marginTop: 20,
   },
   alertCard: {
      width: 400,
      height: 70,
      borderRadius: 8,
      backgroundColor: 'white',
      marginBottom: 10,
   },
   alertText: {
      fontSize: 15,
      fontWeight: '600',
   },
   spacer: {
      width: 300
   }
})