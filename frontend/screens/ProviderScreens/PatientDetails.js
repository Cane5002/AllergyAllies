import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { IconButton } from 'react-native-paper';
import axios from 'axios';

export default function PatientDetails({ route, navigation }) {
  const { patient } = route.params;

  const [protocol, setProtocol] = useState();
  const [practice, setPractice] = useState();
  const [percent, setPercent] = useState();
  const [startDate, setStartDate] = useState();
  const [lastTreatment, setLastTreatment] = useState();
  const [loading, setLoading] = useState(true);
  const [maintenanceNums, setMaintenanceNums] = useState();
  const [recentPatients, setRecentPatients] = useState([]);
  const [deletedPatients, setDeletedPatients] = useState([]);

  // Get the current bottles for this patient's practice
  useEffect(() => {

    /* 
    1 - Get patient's practice and the practice's protocols
    */
    const findPracticeAndProtocol = async () => {
      const protocol = await axios.get(`http://localhost:5000/api/getProtocol/${patient.practiceID}`)
      const practice = await axios.get(`http://localhost:5000/api/practice/${patient.practiceID}`)

      if (protocol.status == 200) {
        setProtocol(protocol.data.protocol);
      }
      if (practice.status == 200) {
        setPractice(practice.data);
      }
    }
    if (!protocol || !practice) { findPracticeAndProtocol(); }

    /* 
    2 - Get the patient's first treatment
    */
    const getFirstTreatment = async () => {
      const treatment = await axios.get(`http://localhost:5000/api/getFirstTreatment/${patient._id}`)
      if (treatment.data.length == 0) {
        setStartDate('[Unavailable]')
      }
      else {
        //convert into javascript Date object
        const javascriptDate = new Date(treatment.data[0].date);
        //standardize timezone
        const utcDate = new Date(javascriptDate.getTime() + javascriptDate.getTimezoneOffset() * 60 * 1000);
        const setDate = utcDate.toLocaleDateString('en-US', {
          year: '2-digit',
          month: '2-digit',
          day: '2-digit',
        });

        setStartDate(setDate)
      }
    }
    if (!startDate && patient) { getFirstTreatment(); }

    /* 
    3 - Get the patient's most recent treatment
    */
    const getLastTreatment = async () => {
      let treatment = await axios.get(`http://localhost:5000/api/getLastTreatment/${patient._id}`) 

      let practiceBottles = protocol.bottles
      let latestData = { 
        bottles: [],
        daysSinceLast: -1,
      }
      // If we get a treatment
      if (treatment && treatment.data.length > 0) {
        let latest = treatment.data[0];

        let treatmentDate = new Date(latest.date);
        let curDate = new Date();

        latestData = { bottles: practiceBottles.map((bottle, index) => {
            if (bottle.bottleName != latest.bottles[index].nameOfBottle) {
              return {
                injVol: '[Unavailable]',
                currBottleNumber: '[Unavailable]'
              }
            }
            return { injVol: latest.bottles[index].injVol, currBottleNumber: latest.bottles[index].currBottleNumber }
          }),
          daysSinceLast: Math.round( (curDate.getTime() - treatmentDate.getTime()) / (1000 * 3600 * 24))
        }
      }
      else {
        const bottle = {
          injVol: '[Unavailable]',
          currBottleNumber: '[Unavailable]'
        }

        for (let i = 0; i < practiceBottles.length; i++) {
          latestData.bottles.push(bottle);
        }
      }
      setLastTreatment(latestData)
    }
    if (!lastTreatment && protocol && patient) { getLastTreatment(); }

    // GET PROGRESS BLOCK
    const getPercentMaintenance = async () => {
      try {
        const percentMaintenance = await axios.get(`http://localhost:5000/api/findPercentMaintenance/${patient._id}`, {
          validateStatus: () => true,
        })
        if (percentMaintenance.status === 200) {
          setPercent(percentMaintenance.data.array)
        }
        else {
          let length = protocol.bottles.length;
          const arr = new Array(length);

          for (let i = 0; i < length; i++) {
            arr[i] = '[Unavailable] - Requires 2 Injections';
          }
          setPercent(arr)
        }
      }
      catch (err) {
        let length = protocol.bottles.length;
        const arr = new Array(length);

        for (let i = 0; i < length; i++) {
          arr[i] = '[Unavailable] - Requires 2 Injections';
        }
        setPercent(arr)
      }
    }
    if (!percent && patient && protocol) { getPercentMaintenance(); }

    // GET MAINTENANCE NUMBERS
    const getMaintNumber = () => {
      const l = protocol.bottles.length;
      let mN = []
      const insert = {
        maintenanceNumber: '[Unavailable]'
      }
      if (patient.maintenanceBottleNumber.length < l) {
        for (let i = 0; i < l; i ++) {
          mN[i] = insert;
        }

        setMaintenanceNums(mN);
      }
      else {
        setMaintenanceNums(patient.maintenanceBottleNumber);
      }
    }
    if (!maintenanceNums && protocol) {getMaintNumber();}
    if (practice && protocol && startDate && lastTreatment && percent) { setLoading(false); }
  })
  if (loading) return ('Loading...');

  // Create a section for each vial
  const Vials = () => (
    <div>
      {protocol.bottles.map((bottle, index) =>
        <View style={styles.section} key={index}>
          {/* VIAL NAME */}
          <Text style={styles.prompt2}>{bottle.bottleName}</Text>

          {/* MAINTENANCE BOTTLE NUMBER */}
          <View style={{ flex: 1, flexDirection: 'row', paddingTop: 7 }}>
            <Text style={styles.prompt3}>Maintenance Bottle: </Text>
            <Text style={{ ...styles.data2, alignSelf: 'center', }}>{maintenanceNums[index].maintenanceNumber}</Text>
          </View>

          {/* PROGRESS */}
          <View style={{ flex: 1, flexDirection: 'row', paddingTop: 7 }}>
            <Text style={styles.prompt3}>Progress: </Text>
            <Text style={{ ...styles.data2, alignSelf: 'center', }}>{percent[index] + "\%"}</Text>
          </View>

          {/* LAST INJECTION */}
          <Text style={{ ...styles.prompt2, paddingTop: 14 }}>Last Injection</Text>

          {/* DOSAGE */}
          <View style={{ flex: 1, flexDirection: 'row', paddingTop: 7 }}>
            <Text style={styles.prompt3}>Dosage: </Text>
            <Text style={{ ...styles.data2, alignSelf: 'center', }}> {lastTreatment.bottles[index].injVol} </Text>
          </View>

          {/* BOTTLE NUMBER */}
          <View style={{ flex: 1, flexDirection: 'row', paddingTop: 7 }}>
            <Text style={styles.prompt3}>Bottle: </Text>
            <Text style={{ ...styles.data2, alignSelf: 'center', }}> {lastTreatment.bottles[index].currBottleNumber} </Text>
          </View>
        </View>
      )}
    </div>

  );

  const removePatient = async (patientToDelete) => {
    try {

       setDeletedPatients((prevDeletedPatients) => [...prevDeletedPatients, patientToDelete]);

       // update the local state of patients/cards
       const updatedPatients = recentPatients.filter((patient) => patient._id !== patientToDelete._id);
       setRecentPatients(updatedPatients);
  
       // mark patient for deletion in API
       await axios.delete(`http://localhost:5000/api/deletePatient/${patientToDelete._id}`);

    } catch (error) {
       console.error('Error deleting patient in DB', error);
       setRecentPatients(prevPatients => [...prevPatients, patientToDelete]);
    }
 };

  const PracticeSection = () => (
    <View style={styles.section}>
      {/* TITLE */}
      <Text style={styles.prompt2}>Practice Info</Text>

      {/* PRACTICE NAME */}
      <View style={{ flex: 1, flexDirection: 'row', paddingTop: 7 }}>
        <Text style={styles.prompt3}>Name: </Text>
        <Text style={{ ...styles.data2, alignSelf: 'center', }}>{practice.practiceName}</Text>
      </View>
    </View>
  )

  const IconSection = () => (
    <View style={styles.section}>
      <IconButton
        icon="account-circle"
        iconColor="green"
        size={150}
        style={{ alignSelf: 'center', marginBottom: -10, marginTop: -5 }}
      />
      <Text style={styles.prompt}>{patient.firstName} {patient.lastName}</Text>
      <Text style={{ fontSize: 12, alignSelf: 'center', }}>{patient.email}</Text>
      <Text style={{ fontSize: 12, alignSelf: 'center', }}>{patient.phone}</Text>
    </View>
  )

  const PersonalInfo = () => (
    <View style={styles.section}>
      {/* TITLE */}
      <Text style={styles.prompt2}>Personal Info</Text>

      <View style={{ flex: 1, flexDirection: 'row', paddingTop: 7 }}>
        <Text style={styles.prompt3}>Date of Birth: </Text>
        <Text style={styles.data}>{patient.DoB}     </Text>
      </View>

      <View style={{ flex: 1, flexDirection: 'row', paddingTop: 7 }}>
        <Text style={styles.prompt3}>Height: </Text>
        <Text style={styles.data}>{patient.height} in</Text>
      </View>

      <View style={{ flex: 1, flexDirection: 'row', paddingTop: 7 }}>
        <Text style={styles.prompt3}>Weight: </Text>
        <Text style={styles.data}>{patient.weight} lb</Text>
      </View>

      <View style={{ flex: 1, flexDirection: 'row', paddingTop: 7 }}>
        <Text style={styles.prompt3}>Status: </Text>
        <Text style={styles.data}>{patient.status}</Text>
      </View>

    </View>
  )

  const DaysSinceLastTreatment = () => {
    // Check valid number
    if (lastTreatment.daysSinceLast < 0) return

    // Is date in attrition?
    let style = styles.data3;
    if (protocol.missedDoseAdjustment.length > 0) {
      let thresholdDays = protocol.missedDoseAdjustment[0].daysMissed;
      if (lastTreatment.daysSinceLast >= thresholdDays) style = styles.warning 
    }
    
    return (
      <View style={{ flex: 1, flexDirection: 'row', paddingTop: 7 }}>
        <Text style={styles.prompt3}>Days since last treatment: </Text>
        <Text style={style}>{lastTreatment.daysSinceLast}</Text>
      </View>
    )
  }

  const TreatmentInfo = () => (
    <View style={styles.section}>
      {/* TITLE */}
      <Text style={{ ...styles.prompt2, paddingTop: 10 }}>Treatment Information: </Text>

      <View style={{ flex: 1, flexDirection: 'row', paddingTop: 7 }}>
        <Text style={styles.prompt3}>Initial Treatment Date: </Text>
        <Text style={styles.data3}>{startDate}</Text>
      </View>

      <View style={{ flex: 1, flexDirection: 'row', paddingTop: 7 }}>
        <Text style={styles.prompt3}>Frequency of injections: </Text>
        <Text style={styles.data3}>[{protocol.injectionFrequency.freq}] {protocol.injectionFrequency.interval}</Text>
      </View>
      
      {DaysSinceLastTreatment()}
    </View>
  )

  const Buttons = () => (
    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', padding: '7' }}>
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate('Maintenance', { patient })}>
        <Text style={styles.buttonText}>Set Maintenance Bottle Numbers</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate('Injections', { patient })}>
        <Text style={styles.buttonText}>Add an Injection</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          removePatient(patient);          
          navigation.navigate('ViewPatients', { patient })}}>
        <Text style={styles.buttonText}>Remove Patient from Database</Text>
      </TouchableOpacity>
    </View>
  )


  return (
    <View style={styles.container}>
      <View style={{ flex: 1, flexDirection: 'row', }}>
        {/* ROW 1*/}
        <View>
          <IconSection />
          <PersonalInfo />
        </View>

        {/* ROW 2*/}
        <View>
          <PracticeSection />
          <TreatmentInfo />
        </View>

        {/* ROW 3*/}
        <Vials />

        {/* ROW 4*/}
        <Buttons />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    alignSelf: 'center',
    minWidth: 800,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  prompt: {
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center'
  },
  prompt2: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1059d5',
    marginLeft: 10,
    marginRight: 2,
  },
  prompt3: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 10,
    marginTop: 2,
  },
  data: {
    fontSize: 16,
    marginRight: 10,
    alignSelf: 'center'
  },
  data2: {
    fontSize: 16,
    marginRight: 10,
    marginTop: 2,
  },
  data3: {
    fontSize: 16,
    marginRight: 10,
    marginTop: 2,
  },
  warning: {
    fontSize: 16,
    fontWeight: '500',
    color: '#e33d37',
    marginRight: 10,
    marginTop: 2,
  },
  section: {
    borderRadius: 10,
    padding: 7,
    backgroundColor: 'white',
    margin: 10,
    minWidth: 300,
    paddingBottom: 10,
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  },
  button: {
    backgroundColor: '#1059d5',
    padding: 10,
    margin: 10,
    height: 50,
    width: 150,
    justifyContent: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 15,
  },
});
