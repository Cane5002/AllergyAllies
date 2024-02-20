import React, { useState, useEffect } from 'react'
import User from '../../User';
import axios from 'axios';

//comment out these 3 lines to run on mobile
//import 'survey-core/defaultV2.min.css';
//import { Model } from 'survey-core';
//import { Survey } from 'survey-react-ui';

import theme from './theme.js';

let calcOnce = true;
let temp = null;

export default function Injections({route, navigation}){

   // Current user
   const userInfo = User();

   // Protocol information
   const [protocol, setProtocol] = useState();
   const [queriedProtocol, setQueriedProtocol] = useState(false);
   let [nextTreatment, setNextTreatment] = useState();
   let [lastTreatment, setLastTreatment] = useState();

   // Today's date
   const date = new Date();

   // Current Patient
   const {patient} = route.params

   // Calculated value - NEEDS TO BE UPDATED WITH JIMMY'S CALCULATIONS
   let [arrayOfBottles, setArrayOfBottles] = useState(Array(99).fill({
      injVol: 0,
      injDilution: 0,
      currBottleNumber: "1",
   }));

   useEffect(() => {
      const findProtocol = async() => {
         try {
            const protocol = await axios.get(`http://localhost:5000/api/getProtocol/${userInfo.practiceID}`)
      
            if (protocol.status == 200) {
               setProtocol(protocol.data.protocol);
               const bottles = protocol.data.protocol.bottles;
            }

            setQueriedProtocol(true);
         }
         catch (err) {
            setQueriedProtocol(true);
            return ('Something went wrong');
         }
      }
      if (!queriedProtocol) {findProtocol();}

      const findTreatment = async() => {
         try {
            const data = {
               patientID: patient._id,
               practiceID: userInfo.practiceID
            }

            setLastTreatment(await axios.get(`http://localhost:5000/api/getLastTreatment/${patient._id}`))
            if(lastTreatment.data[0].attended && calcOnce){
                  calcOnce = false;
                  await axios.post(`http://localhost:5000/api/nextTreatment`, data)
                  setNextTreatment(lastTreatment.data[0])
                  /*
                     Read the new numbers and print them
                  */
                  setLastTreatment(await axios.get(`http://localhost:5000/api/getLastTreatment/${patient._id}`));
                  setArrayOfBottles(lastTreatment.data[0].bottles);
                  //setNextTreatment(lastTreatment.data[0].bottles);
            }
            else{
                  /*
                     Read the last calculated numbers and print them
                  */
                  setLastTreatment(await axios.get(`http://localhost:5000/api/getLastTreatment/${patient._id}`));
                  setArrayOfBottles(lastTreatment.data[0].bottles);
                  setNextTreatment(lastTreatment.data[0]);
            }
            //setNextTreatment(lastTreatment.data[0].bottles);
         }
         catch (err) {
            return ('Something went wrong');
         }
      }
      if (!nextTreatment) {findTreatment();}
      /*
         Displays correct values on update, but numbers will glitch around
      */
      if(lastTreatment != undefined){
         setArrayOfBottles(lastTreatment.data[0].bottles);
      }
   }, [lastTreatment])
   if (!protocol || !nextTreatment) return ('Loading protocol and injection data...');
   

   // Input Fields
   const InjectionQuestions = {
      title: `Add an Injection - ${patient.firstName} ${patient.lastName}`,
      description: `Date: ${date}`,
      textAlign: "center",
      completedHtml: 'Successfully added injection',
      pages:
         [
            {
               name: "main page",
               elements: protocol.bottles.map((vial, index) => {
                  return index % 2 == 0 ? {
                     name: String(index),
                     title: vial.bottleName,
                     type: 'panel',
                     elements: [
                        {
                           name: 'volume' + index,
                           title: 'Injection Volume:',
                           type: 'text',
                           inputType: 'numeric',
                           defaultValue: arrayOfBottles[index].injVol,
                           enableIf: `{b${index}} == "Edit"`,
                           isRequired: true
                        },
                        {
                           name: 'bottleNum' + index,
                           title: 'Bottle Number:',
                           type: 'text',
                           inputType: 'numeric',
                           defaultValue: arrayOfBottles[index].currBottleNumber,
                           startWithNewLine: false,
                           enableIf: `{b${index}} == "Edit"`,
                           isRequired: true
                        },
                        {
                           name: 'dilution' + index,
                           title: 'Injection Dilution:',
                           type: 'text',
                           inputType: 'numeric',
                           defaultValue: arrayOfBottles[index].injDilution,
                           startWithNewLine: false,
                           enableIf: `{b${index}} == "Edit"`,
                           isRequired: true
                        },
                        {
                           name: 'location' + index,
                           title: 'Injection Location:',
                           type: 'dropdown',
                           choices: [
                              'Right Upper',
                              'Right Lower',
                              'Left Upper',
                              'Left Lower'
                           ],
                           defaultValue: 'Right Upper',
                           startWithNewLine: false,
                           enableIf: `{b${index}} == "Edit"`,
                           isRequired: true
                        },
                        {
                           name: 'b' + index,
                           title: 'Accept?',
                           titleLocation: 'left',
                           type: 'boolean',
                           defaultValue: true,
                           valueTrue: 'Lock',
                           valueFalse: 'Edit',
                           renderAs: 'checkbox'
                        },
                     ]
                  } :
                  {
                     name: String(index),
                     title: vial.bottleName,
                     type: 'panel',
                     startWithNewLine: 'false',
                     elements: [
                        {
                           name: 'volume' + index,
                           title: 'Injection Volume:',
                           type: 'text',
                           inputType: 'numeric',
                           defaultValue: arrayOfBottles[index].injVol,
                           enableIf: `{b${index}} == "Edit"`,
                           isRequired: true
                        },
                        {
                           name: 'bottleNum' + index,
                           title: 'Bottle Number:',
                           type: 'text',
                           inputType: 'numeric',
                           defaultValue: arrayOfBottles[index].currBottleNumber,
                           startWithNewLine: false,
                           enableIf: `{b${index}} == "Edit"`,
                           isRequired: true
                        },
                        {
                           name: 'dilution' + index,
                           title: 'Injection Dilution:',
                           type: 'text',
                           inputType: 'numeric',
                           defaultValue: arrayOfBottles[index].injDilution,
                           startWithNewLine: false,
                           enableIf: `{b${index}} == "Edit"`,
                           isRequired: true
                        },
                        {
                           name: 'location' + index,
                           title: 'Injection Location:',
                           type: 'dropdown',
                           choices: [
                              'Right Upper',
                              'Right Lower',
                              'Left Upper',
                              'Left Lower'
                           ],
                           defaultValue: 'Right Upper',
                           startWithNewLine: false,
                           enableIf: `{b${index}} == "Edit"`,
                           isRequired: true
                        },
                        {
                           name: 'b' + index,
                           title: 'Accept?',
                           titleLocation: 'left',
                           type: 'boolean',
                           defaultValue: true,
                           valueTrue: 'Lock',
                           valueFalse: 'Edit',
                           renderAs: 'checkbox'
                        },
                     ]
                  }
               })
            }
         ],
      completeText: 'Submit',
      showQuestionNumbers: 'false',
      questionErrorLocation: 'bottom',
   }

   // ***** SURVEY OBJECT ***** //
   const injectionForm = new Model(InjectionQuestions);

   // Apply theme to survey
   injectionForm.applyTheme(theme);

   injectionForm.onComplete.add((sender, options) => {
      createInjectionObject(sender.data, protocol.bottles, patient);
  });
  console.log("How many")
   return <Survey model={injectionForm} />;
}

const createInjectionObject = async (data, bottles, patient) => {
   let Injections = []

   bottles.map((bottle, index) => {
      const bottleInjection = {
         nameOfBottle: bottle.bottleName,
         injVol: eval(`data.volume${index}`),
         injDilution: eval(`data.dilution${index}`),
         currBottleNumber: eval(`data.bottleNum${index}`),
         locationOfInjection: eval(`data.location${index}`)
      }

      Injections.push(bottleInjection)
   })

   const obj = {
      patientID: patient._id,
      /*
         Reason why this doesn't work during testing, we are updating a treatment with the same date
         This date needs to be updated during testing like this:
         date: new Date('2023-12-17').setHours(0,0,0,0), 
         Then BEFORE clicking submit increment date by at least 1 day to allow nextTreatment to work

         IN PRODUCTION: date: new Date().setHours(0,0,0,0),
      */
      date: new Date('2024-01-09').setHours(0,0,0,0),
      arrayOfBottles: Injections
   }
   
   // Send the treatment obj to the database
   console.log("Treatment added, check the date!")
   const sendSuccessfulTreatment = await axios.patch(`http://localhost:5000/api/updateSuccessfulTreatment`, obj);

}

