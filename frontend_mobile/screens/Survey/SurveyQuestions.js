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
                name: 'Practice Info',
                title: 'Practice Information',
                elements:
                    [
                        {
                            name: 'a',
                            title: 'Practice Name',
                            type: 'text',

                        },
                        {
                            name: 'b',
                            title: 'Treating Physician/Provider Name',
                            type: 'dropdown'
                        },
                        {
                            name: 'c',
                            title: 'Practice Logo',
                            type: 'file',
                        },
                        {
                            name: 'd',
                            title: 'Practice Scrolling Ads',
                            type: 'file',
                        },
                        {
                            name: 'e',
                            title: 'Practice Address',
                            type: 'text',

                        }
                    ],
                showQuestionNumbers: 'false'
            },
            /**************************************
             ************ PROTOCOLS *************** 
             *************************************/
            {
                name: 'Protocols',
                title: 'Protocols',
                elements:
                    [
                        {   
                            name: 'f',
                            title: 'Starting frequency of injections',
                            type: 'panel',
                            elements: [
                                {
                                    type: "text",
                                    inputType: 'number',
                                    name: "f1",
                                    title: "Injections",
                                    titleLocation: 'hidden',
                                    defaultValue: '2',
                                },
                                {
                                    type: "dropdown",
                                    name: "f2",
                                    title: 'Injections',
                                    titleLocation: "left",
                                    choices: [ 'Weekly', 'Monthly'],
                                    defaultValue: 'Weekly',
                                    startWithNewLine: false
                                }
                            ]
                        }, {
                            name: 'g',
                            title: 'Frequency of Clinical Follow-up Appointments',
                            type: 'panel',
                            elements: [
                                {
                                    type: "text",
                                    inputType: 'number',
                                    name: "g1",
                                    title: "Injections",
                                    titleLocation: 'hidden',
                                    defaultValue: '2',
                                },
                                {
                                    type: "dropdown",
                                    name: "g2",
                                    title: 'Injections',
                                    titleLocation: "left",
                                    choices: [ 'Monthly', 'Yearly'],
                                    defaultValue: 'Yearly',
                                    startWithNewLine: false
                                }
                            ]
                        }, {
                            name: 'h',
                            title: 'Frequency of Progress Self-Assessment',
                            type: 'panel',
                            elements: [
                                {
                                    type: "text",
                                    inputType: 'number',
                                    name: "h1",
                                    title: "Injections",
                                    titleLocation: 'hidden',
                                    defaultValue: '2',
                                },
                                {
                                    type: "dropdown",
                                    name: "h2",
                                    title: 'Injections',
                                    titleLocation: "left",
                                    choices: [ 'Monthly', 'Yearly'],
                                    defaultValue: 'Yearly',
                                    startWithNewLine: false
                                }
                            ]
                        }
                    ]
            },
            /**************************************
             ************ TREATMENT *************** 
             *************************************/
            {
                name: 'Treatment',
                title: 'Treatment',
                elements:
                    [
                        {
                            name: 'j',
                            title: 'Treatment Vials',
                            type: 'paneldynamic',
                            panelCount: '0',
                            maxPanelCount: '100',
                            confirmDelete: 'true',
                            templateElements: [{
                                name: 'j1',
                                title: 'Vial Name',
                                type: 'text',
                            },
                            {
                                name: 'j2',
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
             ************* ANTIGENS *************** 
             *************************************/
            {
                name: 'Antigens',
                title: 'Antigens',
                elements:
                    [
                        {
                            name: 'i',
                            title: 'Antigens Tested',
                            type: 'paneldynamic',
                            panelCount: '0',
                            maxPanelCount: '100',
                            confirmDelete: 'true',
                            templateElements: [{
                                name: 'i1',
                                title: 'Antigen Name',
                                type: 'text',
                            }
                            ]
                        }
                    ]
            },
            /**************************************
             ********* DOSE ADJUSTMENTS *********** 
             *************************************/
            {
                name: 'Dose Adjustments',
                title: 'Dose Adjustments',
                elements:
                    [
                        {
                            name: 'k',
                            title: 'Automatic Dose Advancements',
                            type: 'panel',
                            elements: [{
                                name: 'k1',
                                title: 'Automatic',
                                type: 'radiogroup',
                                colCount: '3',
                                defaultValue: 'Default',
                                choices: ['Default', 'Customize', 'Disable'],
                                seperateSpecialChoices: 'true'
                            },
                            {
                                name: 'k2',
                                title: 'Initial Injection Volume (ml)',
                                type: 'text',
                                inputType: 'numeric',
                                placeholder: '0.05',
                                min: '0',
                                max: '10',
                                default: '0.05',
                                enableIf: "{k1} = 'Customize'",
                                defaultValue: '0.05',
                                visibleIf: "{k1} != 'Disable'"
                            },
                            {
                                name: 'k3',
                                title: 'Volume Increment (ml)',
                                type: 'text',
                                inputType: 'numeric',
                                placeholder: '0.05',
                                min: '0',
                                max: '0.50',
                                default: '0.05',
                                enableIf: "{k1} = 'Customize'",
                                defaultValue: '0.05',
                                visibleIf: "{k1} != 'Disable'"
                            },
                            {
                                name: 'k4',
                                title: 'Max Injection Volume (ml)',
                                type: 'text',
                                inputType: 'numeric',
                                placeholder: '0.50',
                                min: '0',
                                max: '10',
                                default: '0.50',
                                enableIf: "{k1} = 'Customize'",
                                defaultValue: '0.50',
                                visibleIf: "{k1} != 'Disable'"
                            }
                            ]

                        }, {
                            name: 'l',
                            title: 'General Rules for Dose Adjustments',
                            type: 'panel',
                            elements:
                                [
                                    {
                                        name: 'l1',
                                        title: 'Automatic',
                                        type: 'radiogroup',
                                        colCount: '3',
                                        defaultValue: 'Default',
                                        choices: ['Default', 'Customize', 'Disable'],
                                        seperateSpecialChoices: 'true'
                                    },
                                    {
                                        name: 'l2',
                                        title: 'What events trigger a dose adjustment?',
                                        type: 'checkbox',
                                        visibleIf: "{l1} != 'Disable'",
                                        enableIf: "{l1} = 'Customize'",
                                        defaultValue: ['Missed Injection Adjustment', 'Large Local Reaction', 'Vial Test Reaction'],
                                        choices: ['Missed Injection Adjustment', 'Large Local Reaction', 'Vial Test Reaction']
                                    },
                                    {
                                        name: 'l3',
                                        title: 'Missed Injection Adjustment',
                                        type: 'panel',
                                        visibleIf: '{l2} contains "Missed Injection Adjustment"',
                                        elements:
                                            [
                                                {
                                                    name: 'l31',
                                                    title: 'What is the maximum number of days a patient can be late on an injection before a dose adjustment is required?',
                                                    type: 'text',
                                                    inputType: 'numeric',
                                                    placeholder: '10',
                                                    min: '0',
                                                    max: '30',
                                                    default: '10',
                                                    enableIf: "{l1} = 'Customize'",
                                                    defaultValue: '10',
                                                    visibleIf: "{l1} != 'Disable'"
                                                },
                                                {
                                                    name: 'l3a',
                                                    title: 'For the following, please specify date ranges, beyond {l31} days for which the dose should be adjusted',
                                                    type: 'panel',
                                                    enableIf: "{l1} = 'Customize'",
                                                    visibleIf: "{l1} != 'Disable'",
                                                    elements:
                                                        [
                                                            {
                                                                type: 'panel',
                                                                name: 'Range 1',
                                                                title: 'Range 1',
                                                                elements: [
                                                                    {
                                                                        name: 'l3a1',
                                                                        title: 'Start',
                                                                        type: 'text',
                                                                        inputType: 'numeric',
                                                                        defaultValueExpression: '{l31} + 1'
                                                                    },
                                                                    {
                                                                        name: 'l3a2',
                                                                        title: 'End',
                                                                        startWithNewLine: 'false',
                                                                        type: 'text',
                                                                        inputType: 'numeric',
                                                                        defaultValueExpression: '{l31} + 3'
                                                                    },
                                                                    {
                                                                        name: 'l3a3',
                                                                        title: 'Action to Take',
                                                                        type: 'radiogroup',
                                                                        colCount: '3',
                                                                        defaultValue: 'Decrease Injection Volume',
                                                                        choices: ['Decrease Injection Volume', 'Dilute Vial', 'Reduce Bottle Number'],
                                                                    },
                                                                    {
                                                                        name:'l3a31',
                                                                        title: 'Decrease volume (ml)',
                                                                        type: 'text',
                                                                        inputType: 'numeric',
                                                                        defaultValue: '0.05',
                                                                        visibleIf: '{l3a3} == "Decrease Injection Volume"'
                                                                    },
                                                                    {
                                                                        name:'l3a32',
                                                                        title: 'How many times should the vial be diluted?',
                                                                        type: 'text',
                                                                        inputType: 'numeric',
                                                                        defaultValue: '1',
                                                                        visibleIf: '{l3a3} == "Dilute Vial"'
                                                                    },
                                                                    {
                                                                        name:'l3a33',
                                                                        title: 'Reduce bottle number by:',
                                                                        type: 'text',
                                                                        inputType: 'numeric',
                                                                        defaultValue: '1',
                                                                        visibleIf: '{l3a3} == "Reduce Bottle Number"'
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                type: 'panel',
                                                                name: 'Range 2',
                                                                title: 'Range 2',
                                                                startWithNewLine: 'false',
                                                                elements: [
                                                                    {
                                                                        name: 'l3b1',
                                                                        title: 'Start',
                                                                        type: 'text',
                                                                        inputType: 'numeric',
                                                                        defaultValueExpression: '{l3a2} + 1'
                                                                    },
                                                                    {
                                                                        name: 'l3b2',
                                                                        title: 'End',
                                                                        startWithNewLine: 'false',
                                                                        type: 'text',
                                                                        inputType: 'numeric',
                                                                        defaultValueExpression: '{l3a2} + 7'
                                                                    },
                                                                    {
                                                                        name: 'l3b3',
                                                                        title: 'Action to Take',
                                                                        type: 'radiogroup',
                                                                        colCount: '3',
                                                                        defaultValue: 'Decrease Injection Volume',
                                                                        choices: ['Decrease Injection Volume', 'Dilute Vial', 'Reduce Bottle Number'],
                                                                    },
                                                                    {
                                                                        name:'l3b31',
                                                                        title: 'Decrease volume (ml)',
                                                                        type: 'text',
                                                                        inputType: 'numeric',
                                                                        defaultValue: '0.10',
                                                                        visibleIf: '{l3b3} == "Decrease Injection Volume"'
                                                                    },
                                                                    {
                                                                        name:'l3b32',
                                                                        title: 'How many times should the vial be diluted?',
                                                                        type: 'text',
                                                                        inputType: 'numeric',
                                                                        defaultValue: '2',
                                                                        visibleIf: '{l3b3} == "Dilute Vial"'
                                                                    },
                                                                    {
                                                                        name:'l3b33',
                                                                        title: 'Reduce bottle number by:',
                                                                        type: 'text',
                                                                        inputType: 'numeric',
                                                                        defaultValue: '2',
                                                                        visibleIf: '{l3b3} == "Reduce Bottle Number"'
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                type: 'panel',
                                                                name: 'Range 3',
                                                                title: 'Range 3',
                                                                elements: [
                                                                    {
                                                                        name: 'l3c1',
                                                                        title: 'Start',
                                                                        type: 'text',
                                                                        inputType: 'numeric',
                                                                        defaultValueExpression: '{l3b2} + 1'
                                                                    },
                                                                    {
                                                                        name: 'l3c2',
                                                                        title: 'End',
                                                                        startWithNewLine: 'false',
                                                                        type: 'text',
                                                                        inputType: 'numeric',
                                                                        defaultValueExpression: '{l3b2} + 7'
                                                                    },
                                                                    {
                                                                        name: 'l3c3',
                                                                        title: 'Action to Take',
                                                                        type: 'radiogroup',
                                                                        colCount: '3',
                                                                        defaultValue: 'Decrease Injection Volume',
                                                                        choices: ['Decrease Injection Volume', 'Dilute Vial', 'Reduce Bottle Number'],
                                                                    },
                                                                    {
                                                                        name:'l3c31',
                                                                        title: 'Decrease volume (ml)',
                                                                        type: 'text',
                                                                        inputType: 'numeric',
                                                                        defaultValue: '0.15',
                                                                        visibleIf: '{l3c3} == "Decrease Injection Volume"'
                                                                    },
                                                                    {
                                                                        name:'l3c32',
                                                                        title: 'How many times should the vial be diluted?',
                                                                        type: 'text',
                                                                        inputType: 'numeric',
                                                                        defaultValue: '3',
                                                                        visibleIf: '{l3c3} == "Dilute Vial"'
                                                                    },
                                                                    {
                                                                        name:'l3c33',
                                                                        title: 'Reduce bottle number by:',
                                                                        type: 'text',
                                                                        inputType: 'numeric',
                                                                        defaultValue: '3',
                                                                        visibleIf: '{l3c3} == "Reduce Bottle Number"'
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                type: 'panel',
                                                                name: 'Range 4',
                                                                title: 'Range 4',
                                                                startWithNewLine: 'false',
                                                                elements: [
                                                                    {
                                                                        name:'l3d11',
                                                                        title: 'Restart patient treatment past this day?',
                                                                        type: 'boolean',
                                                                        defaultValue: 'true'
                                                                    },
                                                                    {
                                                                        name: 'l3d1',
                                                                        title: 'Start',
                                                                        type: 'text',
                                                                        inputType: 'numeric',
                                                                        defaultValueExpression: '{l3c2} + 1'
                                                                    },
                                                                    {
                                                                        name: 'l3d2',
                                                                        title: 'End',
                                                                        startWithNewLine: 'false',
                                                                        type: 'text',
                                                                        inputType: 'numeric',
                                                                        defaultValueExpression: '{l3c2} + 7'
                                                                    },
                                                                    {
                                                                        name: 'l3d3',
                                                                        title: 'Action to Take',
                                                                        type: 'radiogroup',
                                                                        colCount: '3',
                                                                        defaultValue: 'Decrease Injection Volume',
                                                                        choices: ['Decrease Injection Volume', 'Dilute Vial', 'Reduce Bottle Number'],
                                                                    },
                                                                    {
                                                                        name:'l3d31',
                                                                        title: 'Decrease volume (ml)',
                                                                        type: 'text',
                                                                        inputType: 'numeric',
                                                                        defaultValue: '0.2',
                                                                        visibleIf: '{l3d3} == "Decrease Injection Volume"'
                                                                    },
                                                                    {
                                                                        name:'l3d32',
                                                                        title: 'How many times should the vial be diluted?',
                                                                        type: 'text',
                                                                        inputType: 'numeric',
                                                                        defaultValue: '4',
                                                                        visibleIf: '{l3d3} == "Dilute Vial"'
                                                                    },
                                                                    {
                                                                        name:'l3d33',
                                                                        title: 'Reduce bottle number by:',
                                                                        type: 'text',
                                                                        inputType: 'numeric',
                                                                        defaultValue: '4',
                                                                        visibleIf: '{l3d3} == "Reduce Bottle Number"'
                                                                    }
                                                                ]
                                                            },
                                                        ]
                                                }
                                            ],
                                    },
                                    
                                    {
                                        name: 'l4',
                                        title: 'Large Local Reaction Adjustment',
                                        type: 'panel',
                                        visibleIf: '{l2} contains "Large Local Reaction" and {l1} != "Disable"',
                                        elements:
                                            [
                                                {
                                                    name: 'l41',
                                                    title: 'What is the minimum delayed or immediate measured wheal size that constitutes a Large Local Reaction? (mm)',
                                                    type: 'text',
                                                    inputType: 'numeric',
                                                    enableIf: "{l1} = 'Customize'",
                                                    defaultValue: '11',
                                                    visibleIf: "{l1} != 'Disable'"
                                                },
                                                {
                                                    name: 'l4a',
                                                    title: 'Action to Take',
                                                    type: 'radiogroup',
                                                    colCount: '3',
                                                    enableIf: "{l1} = 'Customize'",
                                                    visibleIf: "{l1} != 'Disable'",
                                                    defaultValue: 'Decrease Injection Volume',
                                                    choices: ['Decrease Injection Volume', 'Dilute Vial', 'Reduce Bottle Number'],
                                                },
                                                {
                                                    name:'l4a1',
                                                    title: 'Decrease volume (ml)',
                                                    type: 'text',
                                                    inputType: 'numeric',
                                                    defaultValue: '0.05',
                                                    enableIf: "{l1} = 'Customize'",
                                                    visibleIf: '{l4a} == "Decrease Injection Volume"'
                                                },
                                                {
                                                    name:'l4a2',
                                                    title: 'How many times should the vial be diluted?',
                                                    type: 'text',
                                                    inputType: 'numeric',
                                                    defaultValue: '1',
                                                    enableIf: "{l1} = 'Customize'",
                                                    visibleIf: '{l4a} == "Dilute Vial"'
                                                },
                                                {
                                                    name:'l4a3',
                                                    title: 'Reduce bottle number by:',
                                                    type: 'text',
                                                    inputType: 'numeric',
                                                    defaultValue: '1',
                                                    enableIf: "{l1} = 'Customize'",
                                                    visibleIf: '{l4a} == "Reduce Bottle Number"'
                                                }
                                            ],
                                    },
                                    
                                    {
                                        name: 'l5',
                                        title: 'Vial Test Reaction Adjustment',
                                        type: 'panel',
                                        visibleIf: '{l2} contains "Vial Test Reaction"',
                                        elements:
                                            [
                                                {
                                                name: 'l51',
                                                title: 'What is the minimum wheal size that would trigger a dose adjustment from a Vial Test? (mm)',
                                                type: 'text',
                                                inputType: 'numeric',
                                                enableIf: "{l1} = 'Customize'",
                                                defaultValue: '11',
                                                visibleIf: "{l1} != 'Disable'"
                                                },
                                                {
                                                    name: 'l5a',
                                                    title: 'Action to Take',
                                                    type: 'radiogroup',
                                                    colCount: '3',
                                                    enableIf: "{l1} = 'Customize'",
                                                    visibleIf: "{l1} != 'Disable'",
                                                    defaultValue: 'Decrease Injection Volume',
                                                    choices: ['Decrease Injection Volume', 'Dilute Vial', 'Reduce Bottle Number'],
                                                },
                                                {
                                                    name:'l5a1',
                                                    title: 'Decrease volume (ml)',
                                                    type: 'text',
                                                    inputType: 'numeric',
                                                    defaultValue: '0.05',
                                                    enableIf: "{l1} = 'Customize'",
                                                    visibleIf: '{l5a} == "Decrease Injection Volume"'
                                                },
                                                {
                                                    name:'l5a2',
                                                    title: 'How many times should the vial be diluted?',
                                                    type: 'text',
                                                    inputType: 'numeric',
                                                    defaultValue: '1',
                                                    enableIf: "{l1} = 'Customize'",
                                                    visibleIf: '{l5a} == "Dilute Vial"'
                                                },
                                                {
                                                    name:'l5a3',
                                                    title: 'Reduce bottle number by:',
                                                    type: 'text',
                                                    inputType: 'numeric',
                                                    defaultValue: '1',
                                                    enableIf: "{l1} = 'Customize'",
                                                    visibleIf: '{l5a} == "Reduce Bottle Number"'
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