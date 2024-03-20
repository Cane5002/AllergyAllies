import Checkbox from 'expo-checkbox';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView } from 'react-native';

export default function EditCurrentMedications({navigation}) {
  const [isCheckedSteroid, setCheckedSteroid] = useState(false);
  const [isCheckedNasalAnti, setCheckedNasalAnti] = useState(false);
  const [isCheckedOralAnti, setCheckedOralAnti] = useState(false);
  const [isCheckedOther, setCheckedOther] = useState(false);

  
const handleSubmit = () => {


  Alert.alert(
    'Thank You',
    'Medications Updated',
    [
      {
        text: 'OK'
      },
    ]
  );

  //need to send values back to profile screen to update it
  navigation.goBack();

 
 
}

  

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
    <View style = {styles.titleContainer}>
    <Text style = {styles.title}>Edit Allergy Medications </Text>
    <Text style = {styles.subtitle}>Please check off any of the medications you are currently taking. </Text>
    </View>
            
    <View style={styles.checkboxContainer}>


    <View style={styles.boxAndText}>
    <Checkbox style={styles.checkbox} value={isCheckedSteroid} onValueChange={setCheckedSteroid} />
    <View>
    <Text style = {{marginTop: 18}}>Nasal Steroid Sprays</Text>
    <Text style={styles.subtitle}> e.g. Flonase, Nasonex, Nasacort</Text>
    </View>
    </View>

    <View style={styles.boxAndText}>
    <Checkbox style={styles.checkbox} value={isCheckedNasalAnti} onValueChange={setCheckedNasalAnti} />
    <View>
    <Text style = {{marginTop: 18}}>Nasal Antihistamine Sprays</Text>
    <Text style={styles.subtitle}> e.g. Astelin, Patanase</Text>
    </View>
    </View>

    <View style={styles.boxAndText}>
    <Checkbox style={styles.checkbox} value={isCheckedOralAnti} onValueChange={setCheckedOralAnti} />
    <View>
    <Text style = {{marginTop: 18}}>Oral Antihistamines</Text>
    <Text style={styles.subtitle}> e.g. Zyrtec, Benadryl, Claritin, Allegra</Text>
    </View>
    </View>

    <View style={styles.boxAndText}>
    <Checkbox style={styles.checkbox} value={isCheckedOther} onValueChange={setCheckedOther} />
    <View>
    <Text style = {{marginTop: 18}}>Other</Text>
    <Text style={styles.subtitle}> e.g. Singulair, Cromolyn</Text>
    </View>
    </View>

   
    
 
    
        
        </View>
        <TouchableOpacity
          style = {styles.submitButton}
          onPress={handleSubmit}>
          <Text style = {styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
        </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
    marginVertical: 32,
    padding: 16,
    paddingTop: 4,
  },
  checkbox: {
    margin: 8,
  },
  boxAndText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
    scrollContainer: {
      flexGrow: 1,
      alignItems: 'center',
      paddingHorizontal:8,
      marginHorizontal: 10,
    },
    checkboxContainer: {
      backgroundColor: 'white',
      padding: 18,
      paddingTop: 15,
      borderRadius: 10,
      marginTop: 40,
  
    },
    titleContainer: {
      //backgroundColor: '#f06460',
      padding: 10,
      borderRadius: 10,
      marginTop: 20,
  
    },
    notesContainer: {
      backgroundColor: 'white',
      marginTop: 8,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 2,
      padding: 10,
      paddingVertical: 80,
      color: '#878787',
      fontStyle: 'italic'
  
    },
    dropdown: {
      height: 50,
      borderColor: 'gray',
      borderWidth: 0.5,
      borderRadius: 8,
      paddingHorizontal: 12,
      marginTop: 5,
    },
    icon: {
      marginRight: 5,
    },
    label: {
      position: 'relative',
      fontSize: 14,
      marginBottom: 4
    },
    placeholderStyle: {
      fontSize: 16,
    },
    selectedTextStyle: {
      fontSize: 16,
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 16,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#0d3375',
      marginLeft: 10,
      marginBottom: 5,
    },
  
  
  subtitle: {
      fontWeight: '500',
      fontSize: 14,
      marginLeft: 10,
      marginBottom: 4,
     color: '#878787',
     fontStyle: 'italic',
  },
  
  subtitle2: {
      fontWeight: '400',
      fontSize: 14,
      marginBottom: 4,
      marginTop: 3,
     color: '#878787',
     fontStyle: 'italic'
  }, 
  submitButton: {
      backgroundColor: 'white',
      padding: 15,
      paddingHorizontal: 1,
      borderRadius: 8,
      margin: 20,
      width: '50%',
      //justifyContent: 'flex-end',
      alignItems: 'center',
      shadowColor: 'black',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: .1,
      shadowRadius: 3,
  },
  submitButtonText:{
      color: '#E55555',
      textAlign: 'center',
      fontSize: 15,
      fontWeight: '600',
  },
});
