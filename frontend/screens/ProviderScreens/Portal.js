import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Card, IconButton } from 'react-native-paper';
import AuthContext from '../../AuthContext';
import User from '../../User';
import { fetchRecentAlerts, alertMessage, formatDate } from '../../utils/alertUtils';

export default function Portal({navigation}){

   const { signOut } = useContext(AuthContext);
   const userInfo = User();
   console.log(userInfo);
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
      <View style = {styles.container2}>
         <View style={{flexDirection: 'row'}}>
            <Text style={styles.header2}>Welcome, {firstName}!</Text>
         </View>
         <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap',}}>
            <View style={{marginLeft: 100, marginRight: 170}}>
               <Text style={{fontSize: 18, marginBottom: 10, fontWeight: '500'}}>Your Alerts:</Text>
               {recentAlerts.length === 0 ? (
                  <View style={{ marginRight: 300}}>
                     <Text>There are currently no alerts.</Text>
                  </View>
               ) : (
                  recentAlerts.slice(0, 3).map((alert, index) => (
                     <Card key={index} style={styles.alertCard}>
                        <Card.Title
                           titleStyle={styles.alertText}
                           title= {`${alertMessage(alert.alertType, alert.patientName)}`}
                           subtitle={formatDate(alert.date)}
                        ></Card.Title>
                     </Card>
                  ))
               )}
               {recentAlerts.length === 0 ? (
                  null
               ) : (
                  <TouchableOpacity
                  onPress={() =>
                     navigation.navigate('AllAlerts')}>
                     <Text style = {{textDecorationLine: 'underline', color: '#1059d5', fontSize: 15, marginTop: 10, fontWeight: 'bold',}}>View All Alerts</Text>
                  </TouchableOpacity>
               )}
            </View>
            <View style = {{marginRight: 40}}>
               <TouchableOpacity style={{...styles.providerDashboardItem, backgroundColor: '#71a1f3'}}
                  onPress={() =>
                     navigation.navigate('ViewPatients')
                  }>
                  <Text style={{...styles.providerDashboardText}}>My Patients</Text>
                  <IconButton
                     icon="account-heart"
                     iconColor="white"
                     size={60}
                  />
               </TouchableOpacity>
               <TouchableOpacity style={{...styles.providerDashboardItem, backgroundColor: '#7fd0ae'}}
               onPress={() =>
                  navigation.navigate('Reports')
               }>
                  <Text style={styles.providerDashboardText}>Reports</Text>
                  <IconButton
                     icon="file-chart"
                     iconColor="white"
                     size={60}
                  />
               </TouchableOpacity>
            </View>
            <View style = {{marginBottom: 20}}>
               <TouchableOpacity style={{...styles.providerDashboardItem, backgroundColor: '#937fd0'}}
                  onPress={() =>
                     navigation.navigate('PracticeSurvey')
                  }>
                  <Text style={{...styles.providerDashboardText, fontSize: 16,}}>View/Edit Practice Info</Text>
                  <IconButton
                     icon="pencil"
                     iconColor="white"
                     size={60}
                  />
               </TouchableOpacity>
               <TouchableOpacity style={{...styles.providerDashboardItem, backgroundColor: '#dc6c82'}}
               onPress={() =>
                  signOut()
               }>
                  <Text style={styles.providerDashboardText}>Sign Out</Text>
               <IconButton
                  icon="exit-to-app"
                  iconColor="white"
                  size={60}
               />
               </TouchableOpacity>
            </View>
         </View>
         <View style={{height: 23, backgroundColor: '#1059d5'}}></View>
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