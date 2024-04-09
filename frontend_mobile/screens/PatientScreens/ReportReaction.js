import React, { useState } from 'react';
import { StyleSheet, Text, Keyboard, KeyboardAvoidingView, Alert, TouchableOpacity, Platform, TouchableWithoutFeedback, ScrollView, TextInput, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

//get from backend
const whealSize = 10;


const whealData = [
  { label: `Less than ${whealSize} mm`, value: '1' },
  { label: `${whealSize} mm or larger`, value: '1' },
];

const vialData = [
    { label: `Vial 1: Insects`, value: '1' },
    { label: `Vial 2: Mold`, value: '2' },
    { label: `Vial 3: Pollen`, value: '3' },
  ];

const DropdownComponent = () => {
  const [whealValue, setWhealValue] = useState(null);
  const [isFocusWheal, setIsFocusWheal] = useState(false);

  const [vialValue, setVialValue] = useState(null);
  const [isFocusVial, setIsFocusVial] = useState(false);

  const [notesValue, setNotesValue] = React.useState(null);

  const renderWhealSizeLabel = () => {
   
      return (
        <Text style = {styles.label}>
        Wheal size <Text style={{ color: '#e55555' }}>*</Text>
        </Text> 
      );

  };

  const renderVialNumLabel = () => {
   
    return (
        <Text style = {styles.label}>
        Which injection are you reporting a reaction for? <Text style={{ color: '#e55555' }}>*</Text>
        </Text> 
    );

   

};

const handleSubmit = () => {



   //error if wheal size or vial number not filled out
  if (vialValue === null) {
    Alert.alert('Error', 'Please select an injection');
    return;
  }
  else if (whealValue === null) {
    Alert.alert('Error', 'Please select a wheal size');
    //return;
  }
  else {
   //show alert
  Alert.alert(
    'Thank You',
    'Reaction Submitted',
    [
      {
        text: 'OK'
      },
    ]
  );

  //send whealValue, vialValue, and notesValue to backend

  //reset inputs
  setNotesValue(null)
  setWhealValue(null)
  setVialValue(null)

}

}


  return (

<KeyboardAvoidingView style={styles.container} behavior='position'>
<ScrollView contentContainerStyle={styles.scrollContainer}>
<View style = {styles.titleContainer}>
<Text style = {styles.title}>Report a Reaction </Text>
<Text style = {styles.subtitle}>If you are experiencing an adverse reaction to a recent injection, report it here. </Text>
        
<View style={styles.dropdownContainer}>
      {renderVialNumLabel()}
      <Dropdown
        style={[styles.dropdown, isFocusVial && { borderColor: 'blue' }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={vialData}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocusVial ? 'Select...' : '...'}
        searchPlaceholder="Search..."
        value={vialValue}
        onFocus={() => setIsFocusVial(true)}
        onBlur={() => setIsFocusVial(false)}
        onChange={item => {
          setVialValue(item.value);
          setIsFocusVial(false);
        }}
        
      />
    </View>


    <View style={styles.dropdownContainer}>
      {renderWhealSizeLabel()}
      <Dropdown
        style={[styles.dropdown, isFocusWheal && { borderColor: 'blue' }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={whealData}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocusWheal ? 'Select...' : '...'}
        searchPlaceholder="Search..."
        value={whealValue}
        onFocus={() => setIsFocusWheal(true)}
        onBlur={() => setIsFocusWheal(false)}
        onChange={item => {
          setWhealValue(item.value);
          setIsFocusWheal(false);
        }}
        
      />
    </View>

    <View style={styles.dropdownContainer}>
        <Text style = {styles.label}>Notes</Text>
        <TextInput
        editable
        multiline
        numberOfLines={6}
        maxLength={300}
        placeholder={'Add any notes about your reaction here.'}
        onChangeText={notes => setNotesValue(notes)}
        value={notesValue}
        style={[styles.notesContainer, { color: 'black', fontStyle: 'normal' }]}
        //returnKeyType={'done'}
        blurOnSubmit={true}
        onSubmitEditing={()=>{Keyboard.dismiss()}}
      />
      </View>
    </View>
    <TouchableOpacity
      style = {styles.submitButton}
      onPress={handleSubmit}>
      <Text style = {styles.submitButtonText}>Submit</Text>
    </TouchableOpacity>
    </ScrollView>
    </KeyboardAvoidingView>

    

  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 4,
    flex: 1

  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center'

  },
  dropdownContainer: {
    backgroundColor: 'white',
    padding: 18,
    paddingTop: 15,
    borderRadius: 10,
    marginTop: 40

  },
  titleContainer: {
    //backgroundColor: '#f06460',
    padding: 10,
    borderRadius: 10,
    marginTop: 20

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
    color: '#e55555',
    marginLeft: 10,
    marginBottom: 5,
  },


subtitle: {
    fontWeight: '500',
    fontSize: 14,
    marginBottom: 4,
   marginLeft: 12,
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