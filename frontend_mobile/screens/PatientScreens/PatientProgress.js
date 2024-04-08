
import React, {useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet,  ScrollView } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Carousel from 'react-native-reanimated-carousel';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faSyringe } from '@fortawesome/free-solid-svg-icons/faSyringe'
import { faCalendar } from '@fortawesome/free-regular-svg-icons/faCalendar'
import { faDroplet } from '@fortawesome/free-solid-svg-icons/faDroplet'
import User from '../../User';
import axios from 'axios';

const Tab = createBottomTabNavigator();

export default function PatientProgress({navigation}){

    const userInfo = User();
    const email = userInfo.email;

    const [patient, setPatient] = useState();
    const [treatments, setTreatments] = useState();
    const [loading, setLoading] = useState(true);
    const [activeSlide, setActiveSlide] = useState(0);


    //function that takes in a date from MongoDB and converts it into readable format
    function formatDate(mongoDate){

      //convert into javascript Date object
      const javascriptDate = new Date(mongoDate);
      //standardize timezone
      const utcDate = new Date(javascriptDate.getTime() + javascriptDate.getTimezoneOffset() * 60 * 1000);
      return utcDate.toLocaleDateString('en-US', {
          year: '2-digit',
          month: '2-digit',
          day: '2-digit',
        });

    }

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

  //get the list of treatments associated with patient
  useEffect(() => {

    const findPatient = async () => {
      if (email){
        //replace with your IP address, find quickly from "Metro waiting on exp://<ip>:port" under QR code
        const patientObj = await axios.get(`${process.env.EXPO_PUBLIC_BACKEND_URL}:${process.env.EXPO_PUBLIC_BACKEND_PORT}/api/findPatient/${email}`)
        setPatient(patientObj.data)
      }
    }
    if (!patient) { findPatient(); console.log("can't find patient")}

    const findTreatments = async () => {
      //replace with your IP address, find quickly from "Metro waiting on exp://<ip>:port" under QR code
      const treatmentsObj = await axios.get(`${process.env.EXPO_PUBLIC_BACKEND_URL}:${process.env.EXPO_PUBLIC_BACKEND_PORT}/api/getAllTreatmentsByID/${patient._id}`)
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
  

  //get most recent injection data for carousel  
  let data = []
  if (patient && patient.maintenanceBottleNumber) {
          if (treatments[0]) {
              if (treatments[0].bottles){
              //list of bottles for most recent injection
              const bottles = treatments[0].bottles;
        
              //matching maintenance numbers in treatment data to patient data by comparing name of bottle
              data = bottles.map((bottle, index) => {
                const maintenanceObj = patient.maintenanceBottleNumber.find(
                  (maintenanceBottle) => maintenanceBottle.nameOfBottle === bottle.nameOfBottle
                );
            
                return {
                  id: index + 1,
                  title: `Vial ${index + 1}: ${bottle.nameOfBottle}`,
                  progress: 50, // hardcoded, replace later
                  lastInjDate: formatDate(treatments[0].date),
                  maintenanceNum: maintenanceObj ? maintenanceObj.maintenanceNumber : 'N/A',
                  bottleNum: bottle.currBottleNumber,
                  lastInjDosage: bottle.injVol
                };
              });

              } else {
                 throw new Error("Invalid or missing data for bottles in treatments[0]");
              }

            } else {
              data = [{ id: 1, message: 'No recorded injections yet!' }];
                  //there are no inputted treatments yet, leave data empty
            }

    } else {
      throw new Error("Invalid or missing data for patient or patient maintenance bottle numbers");
    }

    //keeps track of carousel slide
    const onIndexChanged = (index) => {
        setActiveSlide(index);
    };


    //create dots for carousel
    const renderDot = (index) => (
        <View
          key={index}
          style={[
            styles.dot,
            { opacity: index === activeSlide ? 0.6 : 0.2 }, // adjust the opacity based on activeSlide
          ]}
        />
      );

    //create cards for carousel
    const renderCarouselCard = ({ item }) => (
       <View>
             <Text style={styles.title}>{item.title}</Text>  
             <Text style={styles.maintenanceSubtitle}>Maintenance Bottle: {item.maintenanceNum}</Text> 
     
        <View style={styles.card}>
           <View style={{flexDirection: 'row', }}>
             <AnimatedCircularProgress
                 size={150}
                 width={12}
                 rotation={0}
                 lineCap="round"
                 fill={item.progress}
                 tintColor="#1059d5"
                 backgroundColor="#d1d1d1">
                 {
                     (fill) => (
                         <View>
                         <Text style = {styles.progressCircleText}>
                         { item.progress }%
                         </Text>
                         <Text style = {styles.progressCircleSubText}>
                         to maintenance
                         </Text>
                         </View>
                     )
                 }
               </AnimatedCircularProgress>
     
         <View>
     
            <Text style={styles.lastInj}>Last injection:</Text>  
     
           <View>
     
           <View style={{ flexDirection: 'row', alignItems: 'center' }}>
             <View style={styles.icon}>
               <FontAwesomeIcon icon={faCalendar} color={'#737373'} size={20}/> 
             </View>
             <View>
               <Text style={styles.cardSubData}>Date</Text>    
               <Text style={styles.cardData}>{item.lastInjDate}</Text>    
             </View> 
           </View>
     
           <View style={{ flexDirection: 'row', alignContent: 'center' }}>
             <View style={styles.icon}>
               <FontAwesomeIcon icon={faSyringe} color={'#737373'} size={20}/>
             </View>
             <View>
               <Text style={styles.cardSubData}>Dosage</Text>    
               <Text style={styles.cardData}>{item.lastInjDosage} ml</Text>    
             </View> 
           </View>
     
           <View style={{ flexDirection: 'row', alignContent: 'center' }}>
             <View style={styles.icon}>
               <FontAwesomeIcon icon={faDroplet} color={'#737373'} size={20}/> 
             </View>
             <View>
               <Text style={styles.cardSubData}>Bottle</Text>    
               <Text style={styles.cardData}>{item.bottleNum}</Text>    
             </View> 
           </View>
     
           </View>
     
          </View>
         </View>  
        </View>     
       </View>
     );

  

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
    <View>
    
      <ScrollView>
      <View style = {styles.carousel}>
          <Carousel
             data={data}
             loop={false}
             onIndexChanged={onIndexChanged}
             renderItem={renderCarouselCard}
             width={350}
             height = {300}
             onSnapToItem={(index) => setActiveSlide(index)}
           />
     
          <View style={styles.dotsContainer}>
             {data.map((_, index) => renderDot(index))}
          </View>
      </View>
     
     
     <Text style={styles.container}></Text>
     <Text style = {styles.title2}>Past Injections </Text>

     {data[0]?.message ? (
      //if data has a message, no recorded injections yet
         <Text style = {styles.noInjections}>No recorded injections yet!</Text>
      ) : (
      //recorded injections in database
      <>
         {treatments.slice(0, 3).map((treatment, index) => (
          <PastInjectionBlock key={index} treatment={treatment}/>
         ))}
      <TouchableOpacity
       onPress={() => navigation.navigate('ViewAllAppointments')}>
        <Text style = {styles.viewAllAppointments}>View All</Text>
      </TouchableOpacity>
      </>
     )}
     
    </ScrollView>

   </View>
           )
        }

const styles = StyleSheet.create({
    container: {
      paddingTop: 30
    },
    title2 :{
        fontSize: 20,
        fontWeight: 'bold',
        color: '#424242',
        marginLeft: 28,
        marginBottom: 4
    },
    carousel:{
        alignItems: 'center',
        margin: 20,
    },
    progressCircleText:{
        textAlign: 'center',
        fontSize: 24,
        fontWeight: '600',
        color: '#424242'
    },
    progressCircleSubText:{
        textAlign: 'center',
        fontSize: 12,
        fontWeight: '400',
        color: '#424242'
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
    viewAllAppointments: {
      margin: 18,
      color: '#1059d5',
      alignSelf: 'center',
      fontSize: 17,
      fontWeight: '500',
      textDecorationLine: 'underline',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        paddingBottom: 10,
        margin: 4,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
    cardData: {
        fontWeight: '500',
        fontSize: 15,
        marginBottom: 10,
        marginLeft: 12,
        color: "#2b2b2b"
    }, 
    cardSubData: {
        fontWeight: '400',
        fontSize: 12,
        color: '#878787',
        marginLeft: 12,
        marginTop: 8
    }, 
    lastInj: {
        fontWeight: '500',
        fontSize: 15,
        marginBottom: 2,
        marginLeft: 20,
        color: "#2b2b2b"
    }, 
    maintenanceSubtitle: {
        fontWeight: '500',
        fontSize: 14,
        marginBottom: 4,
       marginLeft: 12,
       color: '#878787',
    }, 
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: -12
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 5,
        backgroundColor: 'black',
        marginHorizontal: 5,
    },
    icon: {
        marginLeft: 40,
        alignSelf: 'center',
        verticalAlign: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#424242',
        marginLeft: 10
    },
    noInjections: {
      textAlign: 'center',
      fontSize: 14,
      marginTop: 30
    }
})





