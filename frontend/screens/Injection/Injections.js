import React, { useState, useEffect } from 'react'
import User from '../../User';
import axios from 'axios';

//comment out these 3 lines to run on mobile
import 'survey-core/defaultV2.min.css';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';

import theme from './theme.js';

let calcOnce = true;
let temp = null;

export default function Injections({route, navigation}){

   // Current user
   const userInfo = User();

   // Protocol information
   const [protocol, setProtocol] = useState();
   const [queriedProtocol, setQueriedProtocol] = useState(false);
   let [lastTreatment, setLastTreatment] = useState();

   // Today's date
   const date = new Date();

   // Current Patient
   const {patient} = route.params

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
      if (!queriedProtocol) findProtocol();

      const findTreatment = async() => {
         try {
            let response = await axios.get(`http://localhost:5000/api/getLastTreatment/${patient._id}`);

            if (response && response.data.length > 0) setLastTreatment(response.data[0])
            else setLastTreatment({
               bottles: protocol.bottles.map((b) => {
                  return {
                     nameOfBottle: b.bottleName,
                     injVol: 0,
                     injDilution: 0,
                     currBottleNumber: 1,
                     date: new Date().setHours(0,0,0,0),
                     adverseReaction: false,
                  }
               })
            })
         }
         catch (err) {
            return ('Something went wrong');
         }
      }
      if (!lastTreatment) findTreatment();

   }, [lastTreatment])
   if (!protocol || !lastTreatment) return ('Loading protocol and injection data...');
   
   // Calculate Next Treatment (Verify calc method with Dr.Williams)
   const getMaintenanceBottle = (bottleName) => {
      let bottle = patient.maintenanceBottleNumber.find((b) => {
         return bottleName === b.nameOfBottle.replace(/^"(.*)"$/, '$1');
      });
      return bottle.maintenanceNumber;
   }
   const applyAdjustment = (data, adj) => {
      switch (adj.action) {
         case 'Decrease Injection Volume':
            data.injVol = Math.max(data.injVol - adj.decreaseInjectionVol, protocol.nextDoseAdjustment.startingInjectionVol);
            console.log(data.injVol);
            break;
         case 'Dilute Vial':
            data.injDilution = Math.max(data.injDilution -  adj.decreaseVialConcentration, 0); break;
         case 'Reduce Bottle Number':
            data.currBottleNumber = Math.max((data.currBottleNumber == 'M' ? getMaintenanceBottle(data.nameOfBottle) : data.currBottleNumber) -  adj.decreaseBottleNumber, 1); break;
         default: 
            console.log("Unrecognized action was applied");
      }
      return data;
   }
   let treatmentDate = new Date(lastTreatment.date);
   let curDate = new Date();
   let daysSinceLast = Math.round( (curDate.getTime() - treatmentDate.getTime()) / (1000 * 3600 * 24));
   const nextTreatment = protocol.bottles.map((bottle) => {
      let previous = lastTreatment.bottles.find((b) => {
         return bottle.bottleName === b.nameOfBottle.replace(/^"(.*)"$/, '$1');
      });
      if (!previous) {
         return {
            nameOfBottle: bottle.bottleName,
            injVol: protocol.nextDoseAdjustment.startingInjectionVol,
            injDilution: 0.1,
            currBottleNumber: 1,
         }
      }
      let data = {
         nameOfBottle: bottle.bottleName,
         injVol: previous.injVol,
         injDilution: previous.injDilution,
         currBottleNumber: previous.currBottleNumber,
      }

      // *** Should each trigger stack??
      // ATTRITION
      let attritioned = false;
      // Missed Dose
      if (protocol.triggers.includes('Missed Injection Adjustment') && protocol.missedDoseAdjustment.length > 0) {
         // Find longest missedDoseAdjustment that applies
         let adjustment;
         for (let adj of protocol.missedDoseAdjustment) {
            if (daysSinceLast >= adj.daysMissed && ( !adjustment || adj.daysMissed >= adjustment.daysMissed )) adjustment = adj;
         }

         // If one applies, attrition
         if (adjustment) {
            console.log("Missed Dose Attrition")
            data = applyAdjustment(data, adjustment);
            attritioned = true;
         }
      }
      // Large Reaction
      if (protocol.triggers.includes('Large Local Reaction') && previous.adverseReaction) {
         console.log("Large Reaction Attrition")
         data = applyAdjustment(data, protocol.largeReactionDoseAdjustment);
         attritioned = true;
      }
      // Test Reaction
      if (protocol.triggers.includes('Vial Test Reaction')) {
         console.log("Test Reaction Attrition")
         /* Not implemented */
      }

      //PROGRESS
      if (!attritioned) {
         // Escalate?
         if (data.injVol == protocol.nextDoseAdjustment.maxInjectionVol && data.currBottleNumber != 'M')  {
            console.log("Escalate")
            data.currBottleNumber += 1;
            if (data.currBottleNumber == getMaintenanceBottle(bottle.bottleName)) data.currBottleNumber = 'M';
            data.injVol = protocol.nextDoseAdjustment.startingInjectionVol;
            // ***Increase dilution??
         }
         // Buildup
         else {
            console.log("Buildup")
            data.injVol += protocol.nextDoseAdjustment.injectionVolumeIncreaseInterval;
         }
      }
      return data;
   })

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
               elements: nextTreatment.map((bottle, index) => {
                  return index % 2 == 0 ? {
                     name: String(index),
                     title: bottle.nameOfBottle,
                     type: 'panel',
                     elements: [
                        {
                           name: 'volume' + index,
                           title: 'Injection Volume:',
                           type: 'text',
                           inputType: 'numeric',
                           defaultValue: bottle.injVol,
                           enableIf: `{b${index}} == "Edit"`,
                           isRequired: true
                        },
                        {
                           name: 'bottleNum' + index,
                           title: 'Bottle Number:',
                           type: 'text',
                           inputType: 'numeric',
                           defaultValue: bottle.currBottleNumber,
                           startWithNewLine: false,
                           enableIf: `{b${index}} == "Edit"`,
                           isRequired: true
                        },
                        {
                           name: 'dilution' + index,
                           title: 'Injection Dilution:',
                           type: 'text',
                           inputType: 'numeric',
                           defaultValue: bottle.injDilution,
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
                     title: bottle.nameOfBottle,
                     type: 'panel',
                     startWithNewLine: 'false',
                     elements: [
                        {
                           name: 'volume' + index,
                           title: 'Injection Volume:',
                           type: 'text',
                           inputType: 'numeric',
                           defaultValue: bottle.injVol,
                           enableIf: `{b${index}} == "Edit"`,
                           isRequired: true
                        },
                        {
                           name: 'bottleNum' + index,
                           title: 'Bottle Number:',
                           type: 'text',
                           inputType: 'numeric',
                           defaultValue: bottle.currBottleNumber,
                           startWithNewLine: false,
                           enableIf: `{b${index}} == "Edit"`,
                           isRequired: true
                        },
                        {
                           name: 'dilution' + index,
                           title: 'Injection Dilution:',
                           type: 'text',
                           inputType: 'numeric',
                           defaultValue: bottle.injDilution,
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
      console.log(sender.data);
      createInjectionObject(sender.data, protocol.bottles, patient);
   });
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

   const treatment = {
      patientID: patient._id,
      practiceID: patient.practiceID,
      date: new Date().setHours(0,0,0,0),
      bottles: Injections
   }
   
   // Send the treatment obj to the database
   console.log("Treatment added, check the date!")
   const sendSuccessfulTreatment = await axios.post(`http://localhost:5000/api/addTreatment`, treatment);
   location.reload();
}

