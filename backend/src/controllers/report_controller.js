const Patient = require('../Models/patient');
const protocol = require('../Models/protocols')
const treatment = require('../Models/treatment');
const { Report } = require('../Models/report');
const Provider = require('../Models/provider');

const { getAllPatientsHelper } = require('../controllers/patient_controller');
const { generateReport, findMatchingBottle } = require('../helpers/reportHelper');

// async function getLatestTreatment(patientID, attended = true) {
//     const patientTreatment = await treatment.findOne({
//         patientID: patientID.toString(),
//         attended: attended,
//     }).sort({ date: -1});
    
//     return patientTreatment;
// }

async function getLatestTreatment(params) {
    const patientTreatment = await treatment.findOne(params).sort({ date: -1});
    
    return patientTreatment;
}

exports.deleteReport = async (req, res) => {
    const reportID = req.params.id;
    const foundReport = await Report.findById(reportID);
    if(!foundReport) {
        return res.status(400).json({message: "Report not found"});
    }

    try{
        await Report.findByIdAndDelete(reportID);
    } catch (error) { 
        return res.status(404).json({ message: error.message })
    };

    return res.status(200).json({message: "Report deleted"})
}

exports.deleteAllReports = async (req, res) => {
    try {
        const result = await Report.deleteMany({});
        if (result.deletedCount > 0) {
            return res.status(200).json({ message: "All reports deleted"});
        } else {
            return res.status(201).json({ message: "No reports found"});
        }
    } catch (error) {
        return res.status(401).json(error.message);
    }
}

exports.getAllReports = async (req, res) => {
    const providerID = req.params.providerID;
    try {
        const provider = await Provider.findById(providerID);
        if (!provider) {
            return res.status(401).json({message: "Provider not found"});
        }
        const reports = await Report.find({ practiceID: provider.practiceID}).sort({_id: -1}).select({reportName: 1, reportType: 1, data: 1});
        return res.status(200).json({ reports });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

exports.getAllReportNames = async (req, res) => {
    const providerID = req.params.providerID; 
    try {
        const provider = await Provider.findById(providerID);
        if (!provider) {
            return res.status(401).json({message: "Provider not found"});
        }

        const reports = await Report.find({ practiceID: provider.practiceID}).select('-providerID -practiceID -data -createdAt -updatedAt -__v');
        return res.status(200).json({ reports });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

exports.getReportData = async (req, res) => {
    const reportID = req.params.id;

    try {
        const foundReport = await Report.findById(reportID);
        if (foundReport) {
            return res.status(200).json({ data: foundReport.data });
        } else {
            return res.status(400).json({ message: "Report not found" });
        }
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

/*============== Generate Report Functions ====================*/
const cellStyleMain = "padding: 5px; border: 1px solid #dddddd; font-weight: bold; color: #08088f; background-color: #FF0000"
const cellStyleSub = "padding: 5px; border: 1px solid #dddddd;"

exports.generateApproachingMaintenanceReport = async (req, res) => {
    const providerID = req.params.providerID;
    const reportType = "ApproachingMaintenance";
    const provider = await Provider.findById(providerID);

    if (!provider) {
        return res.status(401).json({ message: "Provider not found" });
    }

    const patientsList = await getAllPatientsHelper(provider.practiceID);
    const approachingMaintenanceData = [];

    // Iterate over each patient, checking their bottles
    for (const patient of patientsList) {
        if(patient.status === "MAINTENANCE") {
            continue;
        }

        // find treatment data
        const patientTreatment = await getLatestTreatment({
            patientID: patient._id.toString()
        });
        
        if (!patientTreatment) {
            continue;
        }

        const vialInfo = [];
        let treatmentStartDate = new Date();
        let allBottlesAtMaintenance = true;
        let atleastOneMaintenanceBottle = false;
        
        // iterate over patient treatment vials
        for (const bottle of patientTreatment.bottles) {
            
            // match bottle in patient model to bottle in treatment (b)
            const matchingBottle = await findMatchingBottle(patient, bottle);
            if (!matchingBottle) {
                console.log("Couldnt find matching bottle for " + bottle.nameOfBottle);
                continue;
            }
            let patientCurrentBottleNumber = bottle.currBottleNumber;

            // check if bottle meets approaching maint. def.
            if (patientCurrentBottleNumber === 'M') {
                atleastOneMaintenanceBottle = true;
                patientCurrentBottleNumber = matchingBottle.maintenanceNumber;

            } else {
                allBottlesAtMaintenance = false;
            } 

            // eg: Pollen 3/7, Mold 7/7 (M)
            vialInfo.push({ 
                name: bottle.nameOfBottle, 
                status: `${bottle.currBottleNumber}/${bottle.injDilution} (${matchingBottle.maintenanceNumber})`, 
                lastInjection: `${bottle.injVol}`
            });

            // get earliest treatment date
            if(treatmentStartDate > bottle.date) {
                treatmentStartDate = bottle.date;
            }
        }

        if (vialInfo.length > 0 && !allBottlesAtMaintenance && atleastOneMaintenanceBottle) {
            approachingMaintenanceData.push({
                patientName: patient.firstName + " " + patient.lastName,
                startDate: treatmentStartDate,
                DOB: patient.DoB ? patient.DoB : 'N/A',
                phoneNumber: patient.phone ? patient.phone : 'N/A',
                email: patient.email ? patient.email : 'N/A',
                vialName: vialInfo[0].name,
                vialStatus: vialInfo[0].status,
                lastInjection: vialInfo[0].lastInjection,
                cellStyle: cellStyleMain
            });
            for (let i = 1; i < vialInfo.length; i++) {
                approachingMaintenanceData.push({
                    patientName: "",
                    startDate: "",
                    DOB: "",
                    phoneNumber: "",
                    email: "",
                    vialName: vialInfo[i].name,
                    vialStatus: vialInfo[i].status,
                    lastInjection: vialInfo[i].lastInjection,
                    cellStyle: cellStyleSub
                });
            }
        }
    }

    // Generate the report
    try {
        if (approachingMaintenanceData.length > 0) {
            const manual = true;
            const savedReport = await generateReport(providerID, provider.practiceID, reportType, manual, approachingMaintenanceData);
            return res.status(200).json(savedReport);
        } else {
            return res.status(201).json({message: "No patients approaching maintenance"});
        }
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

exports.generateAttritionReport = async (req, res) => {
    try {
        const providerID = req.params.providerID;  
        const reportType = "Attrition";
        const provider = await Provider.findById(providerID);
        if (!provider) {
            return res.status(401).json({ message: "Provider not found"});
        }
        const patientsList = await getAllPatientsHelper(provider.practiceID); 

        const today = new Date();
        const patientAttrition = [];
        for (const patient of patientsList) {
            if (patient.status !== "ATTRITION") {
                continue;
            }

            const vialInfo = [];

            // get last not attended treatment
            const foundTreatment = await getLatestTreatment({
                patientID: patient._id.toString(),
                attended: false,
            })

            if (!foundTreatment) {
                console.log(`treatment not found in attrition report for ${patient.firstName} ${patient.lastName}`);
                continue;
            }
  
            for(const bottle of foundTreatment.bottles) {
                // find protocol to find out max bottle number
                const matchingBottle = await findMatchingBottle(patient, bottle);
                if (!matchingBottle) {
                    console.log("Couldnt find matching bottle for " + bottle.nameOfBottle);
                    continue;
                }
                if(bottle.currBottleNumber === 'M') {
                    bottle.currBottleNumber = matchingBottle.maintenanceNumber;
                } 
                
                // eg: Pollen 3/7, Mold 7/7 (M)
                vialInfo.push({ 
                    name: bottle.nameOfBottle, 
                    status: `${bottle.currBottleNumber}/${bottle.injDilution} (${matchingBottle.maintenanceNumber})`, 
                    lastInjection: `${bottle.injVol}`
                });
            }

            if (vialInfo.length > 0) {
                const timeDiff= today - patient.statusDate;
                const daysSinceLastInjection = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
                patientAttrition.push({
                    patientName: patient.firstName + " " + patient.lastName,
                    daysSinceLastInjection: daysSinceLastInjection,
                    statusDate: patient.statusDate ? patient.statusDate : 'N/A',
                    DOB: patient.DoB ? patient.DoB : 'N/A',
                    phoneNumber: patient.phone ? patient.phone : 'N/A',
                    email: patient.email ? patient.email : 'N/A',
                    vialName: vialInfo[0].name,
                    vialStatus: vialInfo[0].status,
                    lastInjection: vialInfo[0].lastInjection,
                    cellStyle: cellStyleMain
                });
                for (let i = 1; i < vialInfo.length; i++) {
                    patientAttrition.push({
                        patientName: "",
                        daysSinceLastInjection: "",
                        statusDate: "",
                        DOB: "",
                        phoneNumber: "",
                        email: "",
                        vialName: vialInfo[i].name,
                        vialStatus: vialInfo[i].status,
                        lastInjection: vialInfo[i].lastInjection,
                        cellStyle: cellStyleSub
                    });
                }
            }
        }

        if (patientAttrition.length > 0) {
            const manual = true;
            const savedReport = await generateReport(providerID, provider.practiceID, reportType, manual, patientAttrition);
            return res.status(200).json(savedReport);
        } else {
            return res.status(201).json({message: "No patients at risk of attrition."})
        }
        
    } catch (error) {
        return res.status(400).json({ message:`Error in attrition ${error.message}` }); 
    }
}

// not working - requires a vial size associated with vials 
exports.generateRefillsReport = async (req, res) => {
    const providerID = req.params.providerID;
    const reportType = "Refills";
    const patientRefillsData = [];

    const provider = await Provider.findById(providerID);
    if (!provider) {
        return res.status(401).json({ message: "Provider not found"});
    }

    const patientsList = await getAllPatientsHelper(provider.practiceID);

    for (const p of patientsList) {
        
        const patientTreatment = await getLatestTreatment({
            patientID: p._id.toString()
        })

        const foundProtocol = await protocol.findOne({ practiceID: provider.practiceID });

        if (!foundProtocol || !patientTreatment) {
            continue;
        }

        const vialInfo = [];
        for (const bottle of patientTreatment.bottles) {
            if (!bottle.needsRefill) continue

            const matchingBottle = await findMatchingBottle(p, bottle);
            if (!matchingBottle) {
                console.log("Couldnt find matching bottle for " + bottle.nameOfBottle);
                continue;
            }
            if (bottle.currBottleNumber === 'M') bottle.currBottleNumber = matchingBottle.maintenanceNumber;
            vialInfo.push({ 
                name: bottle.nameOfBottle, 
                status: `${bottle.currBottleNumber}/${bottle.injDilution} (${matchingBottle.maintenanceNumber})`, 
                lastInjection: `${bottle.injVol}`,
                expiration: bottle.expirationDate
            });
        }

        if (vialInfo.length > 0) {
            patientRefillsData.push({
                patientName: p.firstName + " " + p.lastName,
                DOB: p.DoB ? p.DoB : "N/A",
                email: p.email ? p.email : "N/A",
                phoneNumber: p.phone ? p.phone : "N/A",
                expiration: vialInfo[0].expiration,
                vialName: vialInfo[0].name,
                vialStatus: vialInfo[0].status,
                lastInjection: vialInfo[0].lastInjection,
                cellStyle: cellStyleMain
            });
            for (let i = 1; i < vialInfo.length; i++) {
                patientRefillsData.push({
                    patientName: "",
                    DOB: "",
                    email: "",
                    phoneNumber: "",
                    expiration: vialInfo[i].expiration,
                    vialName: vialInfo[i].name,
                    vialStatus: vialInfo[i].status,
                    lastInjection: vialInfo[i].lastInjection,
                    cellStyle: cellStyleSub
                });
            }
        }
    }

    try {
        if (patientRefillsData.length > 0) {
            const savedReport = await generateReport(providerID, provider.practiceID, reportType, true, patientRefillsData);
            return res.status(200).json(savedReport);
        } else {
            return res.status(201).json({message: "No patients need refills"});
        }
    } catch (error) {
        return res.status(400).json({ message: error.message }); 
    }
}

exports.generateNeedsRetestReport = async (req, res) => {
    const providerID = req.params.providerID; 
    const reportType = "NeedsRetest";
    const provider = await Provider.findById(providerID);

    if(!provider) {
        return res.status(401).json({ message: "Provider not found"});
    }

    const patientsList = await getAllPatientsHelper(provider.practiceID); 
    const needsRetestOutput = [];

    for (const patient of patientsList) {
        if(patient.status !== "MAINTENANCE") {
            continue;
        }

        // get newest treatment data
        const patientTreatment = await getLatestTreatment({
            patientID: patient._id.toString()
        })

        if (!patientTreatment) {
            continue;
        }

        let dateLastTested;
        if (!patientTreatment.lastVialTests) {
            dateLastTested = "N/A";
        } else {
            dateLastTested = "Needs Implementation"
        }

        needsRetestOutput.push({
            patientName: patient.firstName + " " + patient.lastName,
            treatmentStartDate: patient.treatmentStartDate ? patient.treatmentStartDate : 'N/A',
            maintenanceDate: patient.statusDate ? patient.statusDate : 'N/A',
            dateLastTested: dateLastTested,
            DOB: patient.DoB ? patient.DoB : 'N/A',
            phoneNumber: patient.phone ? patient.phone : 'N/A',
            email: patient.email ? patient.email : 'N/A',
            cellStyle: cellStyleMain
        });
    }

    try {
        if (needsRetestOutput.length > 0) {
            const manual = true;
            const savedReport = await generateReport(providerID, provider.practiceID, reportType, manual, needsRetestOutput);
            return res.status(200).json(savedReport);
        } else {
            return res.status(201).json({message: "No patients need retest"});
        }
    } catch (error) {
        return res.status(400).json({ message: error.message }); 
    }
}

// snoozes a patient showing up on needs retest report
exports.needsRetestSnooze = async (req, res) => {
    const patientEmail = req.body.email;
    const snoozeDuration = req.body.snoozeDuration;

    try {
        const patient = await Patient.findOne({ email: patientEmail});

        if (!patient) {
            return res.status(401).json({ message: "patient not found"});
        }

        // needsRetest in needsRetestData assumed true if this function is called.

        const needsRetestSnooze = patient.needsRetestData.needsRetestSnooze;
        needsRetestSnooze.active = true;
        needsRetestSnooze.dateOfSnooze = new Date();
        needsRetestSnooze.snoozeDuration = snoozeDuration;

        await patient.save();
        return res.status(200).json({ message: "Snooze Applied"});
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

exports.patientRetested = async (req, res) => {
    const patientEmail = req.body.email;

    try {
        const patient = await Patient.findOne({ email: patientEmail });

        if (!patient) {
            return res.status(400).json({ message: "patient not found"});
        }

        patient.needsRetestData.needsRetest = false;

        //apply snooze - needsRetest set false, but needsRetest criteria may still satisfied (until treatment info updated).
        const needsRetestSnooze = patient.needsRetestData.needsRetestSnooze;
        needsRetestSnooze.active = true;
        needsRetestSnooze.dateOfSnooze = new Date();
        needsRetestSnooze.snoozeDuration = 30;

        await patient.save();
        return res.status(200).json({ message: "Patient marked as retested"});

    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

/* Get records and compile functions */

// need function for case where provider wants to see all logs of a specific
// patient for a specific report type. 
// ie: Want all records of AllergyDropsRefillsReport associated with patient John
// williams mentioned this in a prior meeting ^
// note: These might be able to be worked in to the above ^