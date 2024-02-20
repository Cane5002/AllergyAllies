import React, { useCallback } from 'react';
import { Platform, StyleSheet } from 'react-native';
import axios from 'axios';

//comment out these 3 lines to run on mobile
//import 'survey-core/defaultV2.min.css';
//import { Model } from 'survey-core';
//import { Survey } from 'survey-react-ui';

import theme from './theme.js';
import User from '../../User.js';

// ***** SURVEY QUESTIONS ***** //
import SurveyQuestions from './SurveyQuestions.js';

export default function PracticeSurvey() {
    // ***** SURVEY OBJECT ***** //
    const survey = new Model(SurveyQuestions);

    // Apply theme to survey
    survey.applyTheme(theme);

    // Function to handle survey completion
    const user = User();
    const saveResults = useCallback((sender) => {
        const json = sender.data;
        sendSurvey(user, json);
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

const sendSurvey = async (user, json) => {
    // First, check if this user is a practice
    if (user.role == 2) {
        console.log('patient');
        return
    }
    else {
        const userID = user.id;
        const provider = await axios.get(`http://localhost:5000/api/getProvider/${userID}`);

        if (provider.status === 404) {
            console.log('provider not found');
        }
        else if (provider.status === 200) {
            const pID = provider.data.practiceID;
            createSurveyObj(json, pID);
        }
    }

}

const createSurveyObj = (json, pID) => {
    const survey = {
        practiceInfo: {
            practiceName: json.a,
            providerName: json.b,
            practiceLogo: json.c,
            practiceScrollingAds: json.d,
            practiceAddress: json.e
        },
        protocols: {
            startingFrequency: {
                numInjections: json.f1,
                period: json.f2
            },
            frequencyFollowUp: {
                numInjections: json.g1,
                period: json.g2
            },
            frequencySelfAssess: {
                numInjections: json.h1,
                period: json.h2
            }
        },
        treatments: {
            vials: json.j
        },
        antigens: {
            names: json.i
        },
        doseAdjustments: {
            automaticDoseAdvancements: {
                option: json.k1,
                initialInjectionVolume: json.k2,
                volumeIncrement: json.k3,
                maxInjectionVolume: json.k4
            },
            generalAdjustmentRules: {
                option: json.l1,
                triggerEvents: json.l2,
                missedInjectionAdjustment: {
                    maxNumDaysBeforeAdjustment: json.l31,
                    range1: {
                        start: json.l3a1,
                        end: json.l3a2,
                        event: json.l3a3,
                        decreaseVolume: json.l3a31,
                        timesDilution: json.l3a32,
                        reduceBottleNum: json.l3a33
                    },
                    range2: {
                        start: json.l3b1,
                        end: json.l3b2,
                        event: json.l3b3,
                        decreaseVolume: json.l3b31,
                        timesDilution: json.l3b32,
                        reduceBottleNum: json.l3b33
                    },
                    range3: {
                        start: json.l3c1,
                        end: json.l3c2,
                        event: json.l3c3,
                        decreaseVolume: json.l3c31,
                        timesDilution: json.l3c32,
                        reduceBottleNum: json.l3c33
                    },
                    range4: {
                        start: json.l3d1,
                        end: json.l3d2,
                        event: json.l3d3,
                        decreaseVolume: json.l3d31,
                        timesDilution: json.l3d32,
                        reduceBottleNum: json.l3d33,
                        restartTreatment: json.l3d11
                    },
                },
                largeLocalReactionAdjustment: {
                    minWhealSize: json.l41,
                    event: json.l4a,
                    decreaseVolume: json.l4a1,
                    timesDilution: json.l4a2,
                    reduceBottleNum: json.l4a3
                },
                vialTestReactionAdjustment: {
                    minWhealSize: json.l51,
                    event: json.l5a,
                    decreaseVolume: json.l5a1,
                    timesDilution: json.l5a2,
                    reduceBottleNum: json.l5a3
                }
            }
        },
        default: {

        }
    };
    console.log(survey);
    handleProtocol(survey, pID);
    return survey;
}

const handleProtocol = async (survey, pID) => {
    const nextDoseAdjustments = {
        injectionInterval: survey.doseAdjustments.generalAdjustmentRules.missedInjectionAdjustment.maxNumDaysBeforeAdjustment,
        startingInjectionVol: survey.doseAdjustments.automaticDoseAdvancements.initialInjectionVolume,
        maxInjectionVol: survey.doseAdjustments.automaticDoseAdvancements.maxInjectionVolume,
        injectionVolumeIncreaseInterval: survey.doseAdjustments.automaticDoseAdvancements.volumeIncrement
    }

    const missedDoseAdjustments = {
        doseAdjustMissedDays: survey.doseAdjustments.generalAdjustmentRules.missedInjectionAdjustment.maxNumDaysBeforeAdjustment,
        range1: {
            days: survey.doseAdjustments.generalAdjustmentRules.missedInjectionAdjustment.range1.end,
            event: survey.doseAdjustments.generalAdjustmentRules.missedInjectionAdjustment.range1.event,
            injectionVolumeDecrease: survey.doseAdjustments.generalAdjustmentRules.missedInjectionAdjustment.range1.decreaseVolume,
            decreaseVialConcentration: survey.doseAdjustments.generalAdjustmentRules.missedInjectionAdjustment.range1.timesDilution,
            decreaseBottleNumber: survey.doseAdjustments.generalAdjustmentRules.missedInjectionAdjustment.range1.reduceBottleNum
        },
        range2: {
            days: survey.doseAdjustments.generalAdjustmentRules.missedInjectionAdjustment.range2.end,
            event: survey.doseAdjustments.generalAdjustmentRules.missedInjectionAdjustment.range2.event,
            injectionVolumeDecrease: survey.doseAdjustments.generalAdjustmentRules.missedInjectionAdjustment.range2.decreaseVolume,
            decreaseVialConcentration: survey.doseAdjustments.generalAdjustmentRules.missedInjectionAdjustment.range2.timesDilution,
            decreaseBottleNumber: survey.doseAdjustments.generalAdjustmentRules.missedInjectionAdjustment.range2.reduceBottleNum
        },
        range3: {
            days: survey.doseAdjustments.generalAdjustmentRules.missedInjectionAdjustment.range3.end,
            event: survey.doseAdjustments.generalAdjustmentRules.missedInjectionAdjustment.range3.event,
            injectionVolumeDecrease: survey.doseAdjustments.generalAdjustmentRules.missedInjectionAdjustment.range3.decreaseVolume,
            decreaseVialConcentration: survey.doseAdjustments.generalAdjustmentRules.missedInjectionAdjustment.range3.timesDilution,
            decreaseBottleNumber: survey.doseAdjustments.generalAdjustmentRules.missedInjectionAdjustment.range3.reduceBottleNum
        },
        range4: {
            days: survey.doseAdjustments.generalAdjustmentRules.missedInjectionAdjustment.range4.end,
            restartTreatment: survey.doseAdjustments.generalAdjustmentRules.missedInjectionAdjustment.range4.restartTreatment,
            event: survey.doseAdjustments.generalAdjustmentRules.missedInjectionAdjustment.range4.event,
            injectionVolumeDecrease: survey.doseAdjustments.generalAdjustmentRules.missedInjectionAdjustment.range4.decreaseVolume,
            decreaseVialConcentration: survey.doseAdjustments.generalAdjustmentRules.missedInjectionAdjustment.range4.timesDilution,
            decreaseBottleNumber: survey.doseAdjustments.generalAdjustmentRules.missedInjectionAdjustment.range4.reduceBottleNum
        }
    }

    const largeReactionsDoseAdjustment = {
        whealLevelForAdjustment: survey.doseAdjustments.generalAdjustmentRules.largeLocalReactionAdjustment.minWhealSize,
        event: survey.doseAdjustments.generalAdjustmentRules.largeLocalReactionAdjustment.event,
        decreaseInjectionVol: survey.doseAdjustments.generalAdjustmentRules.largeLocalReactionAdjustment.decreaseVolume,
        adjustVialConcentration: survey.doseAdjustments.generalAdjustmentRules.largeLocalReactionAdjustment.timesDilution,
        adjustBottleNumber: survey.doseAdjustments.generalAdjustmentRules.largeLocalReactionAdjustment.reduceBottleNum
    }

    const vialTestReactionAdjustment = {
        whealLevelForAdjustment: survey.doseAdjustments.generalAdjustmentRules.vialTestReactionAdjustment.minWhealSize,
        event: survey.doseAdjustments.generalAdjustmentRules.vialTestReactionAdjustment.event,
        decreaseInjectionVol: survey.doseAdjustments.generalAdjustmentRules.vialTestReactionAdjustment.decreaseVolume,
        adjustVialConcentration: survey.doseAdjustments.generalAdjustmentRules.vialTestReactionAdjustment.timesDilution,
        adjustBottleNumber: survey.doseAdjustments.generalAdjustmentRules.vialTestReactionAdjustment.reduceBottleNum
    }

    const injectionFrequency = {
        freq: survey.protocols.startingFrequency.numInjections,
        interval: survey.protocols.startingFrequency.period
    }

    let bottles = []
    const vialNames = survey.treatments.vials.map((vial) => {
        const bottleSchema = {
            bottleName: vial.j1,
            shelfLife: vial.j2
        }
        bottles.push(bottleSchema)
    })

    const protocol = {
        practiceID: pID,
        nextDoseAdjustment: nextDoseAdjustments,
        bottles: bottles,
        vialTestReactionAdjustment: vialTestReactionAdjustment,
        missedDoseAdjustment: missedDoseAdjustments,
        largeReactionsDoseAdjustment: largeReactionsDoseAdjustment,
        injectionFrequency: injectionFrequency
    }

    // Here is where we post or patch the protocol to the database.
    let currPracticeProtocol = await axios.get(`http://localhost:5000/api/getProtocol/${pID}`)

    if (currPracticeProtocol.status === 200) {
        let patch = await axios.patch(`http://localhost:5000/api/updateProtocol/${pID}`, protocol)
        console.log(patch)
    }
    else if (currPracticeProtocol.status === 201) {
        let post = await axios.post(`http://localhost:5000/api/addProtocol`, protocol)
        console.log(post)
    }
    //console.log(currPracticeProtocol.status)


    return protocol;
}

const getBottleSchema = (bottleName) => {
    const bottleSchema = {
        bottleName: bottleName
    }

    return bottleSchema
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