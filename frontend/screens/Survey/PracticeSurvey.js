import React, { useEffect, useState, useCallback } from 'react';
import { Platform, StyleSheet } from 'react-native';
import axios from 'axios';

//comment out these 3 lines to run on mobile
import 'survey-core/defaultV2.min.css';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';

import theme from './theme.js';
import User from '../../User.js';

// ***** SURVEY QUESTIONS ***** //
import SurveyQuestions from './SurveyQuestions.js';

export default function PracticeSurvey() {
    const user = User();
    const [loading, setLoading] = useState(true);
    const [protocol, setProtocol] = useState();
    const [practice, setPractice] = useState();

    useEffect(() => {
        const findPracticeAndProtocol = async () => {
            const protocol = await axios.get(`http://localhost:5000/api/getProtocol/${user.practiceID}`)
            const practice = await axios.get(`http://localhost:5000/api/practice/${user.practiceID}`)
        
            if (protocol.status == 200) {
                setProtocol(protocol.data.protocol);
            }
            if (practice.status == 200) {
                setPractice(practice.data);
            }
        }
        if (!protocol || !practice) { findPracticeAndProtocol(); }
        if (practice && protocol) { setLoading(false); }
    })
    if (loading) {
        useCallback(() => {});
        return ('Loading...');
    }

    // ***** SURVEY OBJECT ***** //
    const survey = new Model(SurveyQuestions);

    // Apply theme to survey
    survey.applyTheme(theme);

    // Set Current Values
    survey.mergeData({
            //Practice
        practiceName: practice.practiceName,
        phone: practice.phoneNumber,
        email: practice.email,
        address: practice.address,
        officeHours: practice.officeHours,
        shotHours: practice.allergyShotHours,
        staffList: practice.providerNPIs.map((npi) => { return {NPI: npi}; }),
        missedAdjustment: protocol.missedDoseAdjustment,
            //Protocol
        //Injection Frequency
        count: protocol.injectionFrequency.freq,
        interval: protocol.injectionFrequency.interval,
        treatmentVials: protocol.bottles.map((b) => { return { bottleName: b.bottleName, shelfLife: b.shelfLife }}),
        //Next Dose Adjustment
        initialVolume: protocol.nextDoseAdjustment.startingInjectionVol,
        maxVolumen: protocol.nextDoseAdjustment.maxInjectionVol,
        advancementIncrement: protocol.nextDoseAdjustment.injectionVolumeIncreaseInterval,
        
        triggers: protocol.triggers,
        //Missed Dose Adjustment
        missedAdjustment: protocol.missedDoseAdjustment,
        //Large Reaction Dose Adjustment
        largeReactionWheelSize: protocol.largeReactionsDoseAdjustment.whealLevelForAdjustment,
        largeReactionAction: protocol.largeReactionsDoseAdjustment.action,
        largeReactionDecrease: protocol.largeReactionsDoseAdjustment.decreaseInjectionVol,
        largeReactionDilute: protocol.largeReactionsDoseAdjustment.adjustVialConcentration,
        largeReactionReduce: protocol.largeReactionsDoseAdjustment.adjustBottleNumber,
        //Test Reaction Adjustment
        testReactionWheelSize: protocol.vialTestReactionAdjustment.whealLevelForAdjustment,
        testReactionAction: protocol.vialTestReactionAdjustment.action,
        testReactionDecrease: protocol.vialTestReactionAdjustment.decreaseInjectionVol,
        testReactionDilute: protocol.vialTestReactionAdjustment.adjustVialConcentration,
        testReactionReduce: protocol.vialTestReactionAdjustment.adjustBottleNumber,
    })

    // Function to handle survey completion
    const saveResults = useCallback((sender) => {
        const json = sender.data;
        const practice = {
            practiceName: json.practiceName,
            phoneNumber: json.phone, 
            email: json.email, 
            address: json.address, 
            officeHours: json.officeHours, 
            allergyShotHours: json.shotHours,
            providerNPIs: json.staffList.map((npi) =>{
                return npi.NPI;
            })
        }
        const protocol = {
            injectionFrequency: {
                freq: json.count,
                interval: json.interval
            },
            bottles: json.treatmentVials,
            nextDoseAdjustment: {
                startingInjectionVol: json.initialVolume,
                maxInjectionVol: json.maxVolume,
                injectionVolumeIncreaseInterval: json.advancementIncrement
            },
            triggers: json.triggers,
            largeReactionsDoseAdjustment: {
                whealLevelForAdjustment: json.largeReactionWheelSize,
                action: json.largeReactionAction,
                decreaseInjectionVol: json.largeReactionDecrease,
                adjustVialConcentration: json.largeReactionDilute,
                adjustBottleNumber: json.largeReactionReduce
            },
            vialTestReactionAdjustment: {
                whealLevelForAdjustment: json.testReactionWheelSize,
                action: json.testReactionAction,
                decreaseInjectionVol: json.testReactionDecrease,
                adjustVialConcentration: json.testReactionDilute,
                adjustBottleNumber: json.testReactionReduce
            },
            missedDoseAdjustment: json.missedAdjustment,
        }
        sendSurvey(user, practice, protocol);
    });

    // Attach function to survey
    survey.onComplete.add(saveResults);

    const rend = Platform.select({
        ios: <Text>Please continue on desktop</Text>,
        android: <Text>Please continue on desktop</Text>,
        default: <Survey model={survey} />
    });
    return rend;
}

const sendSurvey = async (user, practice, protocol) => {
    // First, check if this user is an admin
    // if (user.role == 3) {
    if (false) {
        console.log('Not Admin');
        return
    }
    else {
        await axios.put(`http://localhost:5000/api/updatePractice/${user.practiceID}`, practice);
        await axios.put(`http://localhost:5000/api/updateProtocol/${user.practiceID}`, protocol);
    }

}

const styles = StyleSheet.create({
    container: {
        paddingTop: 23,
        paddingLeft: 10,
        paddingRight: 10,
    },
    header: {
        fontSize: 40,
        marginTop: 40,
        fontWeight: '600',
        marginLeft: 100,
        color: '#1059d5',
        marginBottom: 10,
    },
    table: {
        marginLeft: 100,
        width: 800,
    },
    tableHeader: {
        backgroundColor: '#cbdeff',
        borderTopStartRadius: 8,
        borderTopEndRadius: 8,
        color: 'black',
    },
    tableRow2: {
        backgroundColor: '#ebebeb',
    },
    providerDashboardItem: {
        borderRadius: 8,
        height: 100,
        width: 100,
        marginBottom: 10,
        alignItems: 'center',
    },
    providerDashboardText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 15,
        fontWeight: '600',
        marginTop: 20,
        marginBottom: -10,
    },
})