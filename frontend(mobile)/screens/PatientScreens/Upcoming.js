import React from 'react'
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native'
import { IconButton } from 'react-native-paper';

//still a hard coded screen, should contain practice office hours and other appointment info

export default function Upcoming({navigation}){
      return (
         <ScrollView>
            <View style = {styles.header}>
                <Text style={styles.headerText}>12/11/2023</Text>
            </View>
            <View style={styles.info}>
                <IconButton
                     icon="clock"
                     iconColor="#1059d5"
                     size={30}/>
                <Text style={{fontSize:18, fontWeight:500}}>8:00am - 5:00pm</Text>
            </View>
            <View style={styles.info}>
                <IconButton
                     icon="map-marker"
                     iconColor="#1059d5"
                     size={30}/>
                <Text style={{fontSize:18, fontWeight:500}}>ENT Specialists of Nashville</Text>
            </View>
            <View style={styles.info}>
                <IconButton
                     icon="needle"
                     iconColor="#1059d5"
                     size={30}/>
                <Text style={{fontSize:18, fontWeight:500}}>Dosage: XX.00mg</Text>
            </View>
          
         </ScrollView>
      )
   }

const styles = StyleSheet.create({
   container: {
      paddingTop: 30
   },
   header: {
        marginTop: 30,
        width: Dimensions.get('window').width - 30,
        marginBottom: 10,
        height: 60,
        backgroundColor: '#84aef8',
        justifyContent: 'center',
        textstyle:{fontsize: 80},
        alignSelf: 'center',
        borderRadius: 8,
    },
    headerText: {
        fontSize: 18,
        marginBottom: 4,
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'white',
    },
    info: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        marginLeft: 15,
        marginTop: 5,
        marginRight: 15,
        borderBottomWidth: 1,
        borderColor: '#1059d5',
     },
     infoBottom: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        marginLeft: 15,
        marginTop: 5,
        marginRight: 15,
     },
})
