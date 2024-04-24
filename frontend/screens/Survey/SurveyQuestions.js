// ***** SURVEY QUESTIONS ***** //
export default {
    title: "Allergy Allies - Initial Practice Survey",
    description: `Welcome , Please fill out all fields to finish setting up your practice!`,
    textAlign: "center",
    pages:
        [
            /**************************************
             ********** PRACTICE INFO ************* 
             *************************************/
            {
                name: 'practiceInfo',
                title: 'Practice Information',
                elements:
                    [
                        {
                            name: 'practiceName',
                            title: 'Practice Name',
                            type: 'text',

                        },
                        {
                            name: 'address',
                            title: 'Practice Address',
                            type: 'text',

                        },
                        {
                            name: 'email',
                            title: 'Email',
                            type: 'text',
                        },
                        {
                            name: 'phone',
                            title: 'Phone Number',
                            type: 'text',
                        },
                        {
                            name: 'officeHours',
                            title: 'Office Hours',
                            type: 'text',
                        },
                        {
                            name: 'shotHours',
                            title: 'Allergy Shot Hours',
                            type: 'text',
                        }
                    ],
                showQuestionNumbers: 'false'
            },
            /**************************************
             ************** STAFF **************** 
             *************************************/
            {
                name: 'staff',
                title: 'Staff',
                elements: [
                    {
                        name: 'staffList',
                        title: 'Staff',
                        type: 'matrixdynamic',
                        addRowText: 'Add Staff',
                        columns: [
                            {
                                name: 'NPI',
                                title: 'NPI',
                                cellType: 'text',
                                minLength: 10,
                                maxLength: 10,
                                validators: [
                                    { type: 'numeric', text: 'Value must e a number'}
                                ]
                            }
                        ]
                    }
                ]
            },
            /**************************************
             ************ PROTOCOLS *************** 
             *************************************/
            {
                name: 'protocols',
                title: 'Protocols',
                elements:
                    [
                        {   
                            name: 'frequency',
                            title: 'Injection Frequency',
                            type: 'panel',
                            elements: [
                                {
                                    type: "text",
                                    inputType: 'number',
                                    name: "count",
                                    title: "Injections",
                                    titleLocation: 'hidden',
                                    defaultValue: '2',
                                },
                                {
                                    type: "dropdown",
                                    name: "interval",
                                    title: 'Injections',
                                    titleLocation: "left",
                                    choices: [ 'Weekly', 'Monthly'],
                                    defaultValue: 'Weekly',
                                    startWithNewLine: false
                                }
                            ]
                        }
                    ]
            },
            /**************************************
             ************** VIALS ***************** 
             *************************************/
            {
                name: 'vials',
                title: 'Vials',
                elements:
                    [
                        {
                            name: 'treatmentVials',
                            title: 'Treatment Vials',
                            type: 'paneldynamic',
                            panelCount: '0',
                            maxPanelCount: '100',
                            confirmDelete: 'true',
                            templateElements: [{
                                name: 'bottleName',
                                title: 'Vial Name',
                                type: 'text',
                            },
                            {
                                name: 'shelfLife',
                                title: 'Shelf Life (months)',
                                type: 'text',
                                inputType: 'numeric',
                                defaultValue: '6',
                                minValue: '0'
                            }
                            ]
                        }
                    ]
            },
            /**************************************
             ********* DOSE ADJUSTMENTS *********** 
             *************************************/
            {
                name: 'doseAdjustments',
                title: 'Dose Adjustments',
                elements:
                    [
                        {
                            name: 'doseAdvancement',
                            title: 'Automatic Dose Advancements',
                            type: 'panel',
                            elements: [
                            {
                                name: 'initialVolume',
                                title: 'Initial Injection Volume (ml)',
                                type: 'text',
                                inputType: 'numeric',
                                placeholder: '0.05',
                                min: '0',
                                max: '10',
                                default: '0.05',
                                defaultValue: '0.05',
                            },
                            {
                                name: 'advancementIncrement',
                                title: 'Volume Increment (ml)',
                                type: 'text',
                                inputType: 'numeric',
                                placeholder: '0.05',
                                min: '0',
                                max: '0.50',
                                default: '0.05',
                                defaultValue: '0.05',
                            },
                            {
                                name: 'maxVolume',
                                title: 'Max Injection Volume (ml)',
                                type: 'text',
                                inputType: 'numeric',
                                placeholder: '0.50',
                                min: '0',
                                max: '10',
                                default: '0.50',
                                defaultValue: '0.50',
                            }
                            ]

                        }, {
                            name: 'conditionalAdjustment',
                            title: 'Conditional Dose Adjustments',
                            type: 'panel',
                            elements:
                                [
                                    {
                                        name: 'triggers',
                                        title: 'What events trigger a dose adjustment?',
                                        type: 'checkbox',
                                        defaultValue: ['Missed Injection Adjustment', 'Large Local Reaction', 'Vial Test Reaction'],
                                        choices: ['Missed Injection Adjustment', 'Large Local Reaction', 'Vial Test Reaction']
                                    },
                                    {
                                        name: 'missedAdjustment',
                                        title: 'Missed Injection Adjustment',
                                        visibleIf: '{triggers} contains "Missed Injection Adjustment"',
                                        type: 'paneldynamic',
                                        panelCount: '0',
                                        maxPanelCount: '100',
                                        confirmDelete: 'true',
                                        templateElements: [
                                            {
                                                name: 'daysMissed',
                                                title: 'Days Missed',
                                                startWithNewLine: 'false',
                                                type: 'text',
                                                inputType: 'numeric',
                                            },
                                            {
                                                name: 'action',
                                                title: 'Action to Take',
                                                type: 'radiogroup',
                                                colCount: '3',
                                                defaultValue: 'Decrease Injection Volume',
                                                choices: ['Decrease Injection Volume', 'Dilute Vial', 'Reduce Bottle Number'],
                                            },
                                            {
                                                name:'decreaseInjectionVol',
                                                title: 'Decrease volume (ml)',
                                                type: 'text',
                                                inputType: 'numeric',
                                                defaultValue: '0.05',
                                                visibleIf: '{panel.action} == "Decrease Injection Volume"'
                                            },
                                            {
                                                name:'decreaseVialConcentration',
                                                title: 'How many times should the vial be diluted?',
                                                type: 'text',
                                                inputType: 'numeric',
                                                defaultValue: '1',
                                                visibleIf: '{panel.action} == "Dilute Vial"'
                                            },
                                            {
                                                name:'decreaseBottleNumber',
                                                title: 'Reduce bottle number by:',
                                                type: 'text',
                                                inputType: 'numeric',
                                                defaultValue: '1',
                                                visibleIf: '{panel.action} == "Reduce Bottle Number"'
                                            }
                                        ]
                                    },
                                    {
                                        name: 'largeReactionAdjustment',
                                        title: 'Large Local Reaction Adjustment',
                                        type: 'panel',
                                        visibleIf: '{triggers} contains "Large Local Reaction"',
                                        elements:
                                            [
                                                {
                                                    name: 'largeReactionWheelSize',
                                                    title: 'What is the minimum delayed or immediate measured wheal size that constitutes a Large Local Reaction? (mm)',
                                                    type: 'text',
                                                    inputType: 'numeric',
                                                    defaultValue: '11',
                                                },
                                                {
                                                    name: 'largeReactionAction',
                                                    title: 'Action to Take',
                                                    type: 'radiogroup',
                                                    colCount: '3',
                                                    defaultValue: 'Decrease Injection Volume',
                                                    choices: ['Decrease Injection Volume', 'Dilute Vial', 'Reduce Bottle Number'],
                                                },
                                                {
                                                    name:'largeReactionDecrease',
                                                    title: 'Decrease volume (ml)',
                                                    type: 'text',
                                                    inputType: 'numeric',
                                                    defaultValue: '0.05',
                                                    visibleIf: '{largeReactionAction} == "Decrease Injection Volume"'
                                                },
                                                {
                                                    name:'largeReactionDilute',
                                                    title: 'How many times should the vial be diluted?',
                                                    type: 'text',
                                                    inputType: 'numeric',
                                                    defaultValue: '1',
                                                    visibleIf: '{largeReactionAction} == "Dilute Vial"'
                                                },
                                                {
                                                    name:'largeReactionReduce',
                                                    title: 'Reduce bottle number by:',
                                                    type: 'text',
                                                    inputType: 'numeric',
                                                    defaultValue: '1',
                                                    visibleIf: '{largeReactionAction} == "Reduce Bottle Number"'
                                                }
                                            ],
                                    },
                                    {
                                        name: 'testReactionAdjustment',
                                        title: 'Vial Test Reaction Adjustment',
                                        type: 'panel',
                                        visibleIf: '{triggers} contains "Vial Test Reaction"',
                                        elements:
                                            [
                                                {
                                                    name: 'testReactionWheelSize',
                                                    title: 'What is the minimum wheal size that would trigger a dose adjustment from a Vial Test? (mm)',
                                                    type: 'text',
                                                    inputType: 'numeric',
                                                    defaultValue: '11',
                                                },
                                                {
                                                    name: 'testReactionAction',
                                                    title: 'Action to Take',
                                                    type: 'radiogroup',
                                                    colCount: '3',
                                                    defaultValue: 'Decrease Injection Volume',
                                                    choices: ['Decrease Injection Volume', 'Dilute Vial', 'Reduce Bottle Number'],
                                                },
                                                {
                                                    name:'testReactionDecrease',
                                                    title: 'Decrease volume (ml)',
                                                    type: 'text',
                                                    inputType: 'numeric',
                                                    defaultValue: '0.05',
                                                    visibleIf: '{testReactionAction} == "Decrease Injection Volume"'
                                                },
                                                {
                                                    name:'testReactionDilute',
                                                    title: 'How many times should the vial be diluted?',
                                                    type: 'text',
                                                    inputType: 'numeric',
                                                    defaultValue: '1',
                                                    visibleIf: '{testReactionAction} == "Dilute Vial"'
                                                },
                                                {
                                                    name:'testReactionReduce',
                                                    title: 'Reduce bottle number by:',
                                                    type: 'text',
                                                    inputType: 'numeric',
                                                    defaultValue: '1',
                                                    visibleIf: '{testReactionAction} == "Reduce Bottle Number"'
                                                }
                                            ],
                                    }
                                ]

                        }
                    ]
            }
        ],
    showTOC: 'true',
    completeText: 'Submit',
    showPreviewBeforeComplete: 'showAllQuestions',
    showQuestionNumbers: 'false',
    questionErrorLocation: 'bottom',
};