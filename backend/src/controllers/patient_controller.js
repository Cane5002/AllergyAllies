const patient = require('../Models/patient');
const protocols = require('../Models/protocols');
const provider = require('../Models/provider');
const treatment = require('../Models/treatment');

// Needs Testing
const addPatient = async (req, res) => {
    // implement duplicate check
    try {
        const { firstName, lastName, email, phone, password, DoB, height, weight, practiceID } = req.body;

        const data = new patient({
            firstName, lastName, email, phone, password, DoB, height, weight, practiceID
        });
        data.status = "ACTIVE";
        data.tokens = 0;
        data.statusDate = new Date();
        data.lastApptDateBeforeAttrition = new Date();
        data.missedAppointmentCount = 0;

        const protocol = await protocols.findOne({ practiceID: practiceID });

        if (protocol) {
            const bottles = protocol.bottles;
            var b = []
            bottles.map((bottle) => {
                b.push({
                    bottleName: bottle.bottleName,
                    maintenanceNumber: 0
                })
            })

            data.maintenanceBottleNumber = b
        }

        const dataToSave = await data.save();
        return res.status(200).json(dataToSave);
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

// Needs testing
const addPatientToProvider = async (req, res) => {
    try {
        const {patientID, providerCode} = req.body;
        const foundProvider = await provider.findOne({ providerCode: providerCode });
        const foundPatient = await patient.findById(patientID);
        
        if (!foundPatient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        foundPatient.providerID = foundProvider.providerID;

        const updatedPatient = await foundPatient.save();

        return res.status(200).json(updatedPatient);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

const getAllPatientsHelper = async (practiceID) => {
    try {
        const patientsList = await patient.find({practiceID: practiceID});
        return patientsList;
    } catch (error) {
        console.error('Error retrieving list of patients: ', error);
    }
}

// Get all patients from a practice
const getPatientsByPractice = async (req, res) => {
    try {
        const pracID = req.params.practiceID;
        const data = await patient.find({practiceID: pracID});
        return res.json(data);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// Get patient by id
const getPatient = async (req, res) => {
    try {
        const id = req.params.id;
        const foundPatient = await patient.findById(id);
        if (foundPatient) {
            return res.status(200).json(foundPatient);
        } else {
            return res.status(404).json({ message: `Patient not found: ${id}` });
        }
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

// Get patient by id
const findPatient = async (req, res) => {
    try {
        const email = req.params.email;
        const foundPatient = await patient.findOne({email: email});
        if (foundPatient) {
            return res.status(200).json(foundPatient);
        } else {
            return res.status(404).json({ message: `Patient not found: ${email}` });
        }
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

// Get patient by email
const checkEmail = async (req, res) => {
    try {
        const email = req.body.email.toString();
        const data = await patient.findOne({ email: email })
        if (data === null) {
            res.sendStatus(200);
        }
        else {
            res.sendStatus(201);
        }
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

// Delete by ID method
const deletePatient = async (req, res) => {
    try {
        const id = req.params.id;
        const patientToDelete = await patient.findById(id);
        if (!patientToDelete) {
            return res.status(404).json({ message: `Patient not found: ${id}` });
        }
        const firstname = patientToDelete.firstName;

        await patient.findByIdAndDelete(id);
        return res.status(200).json({ message: `Document with ${firstname} has been deleted..` });
    }
    catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

/* TOKEN SYSTEM STARTS (may move to new set of files) */

// this could be moved to database, although this meets requirements fine
const eventsConfig = [
    { eventName: "SymptomsImproved", tokens: 5},
    { eventName: "AtMaintenance", tokens: 25},
    { eventName: "AdvancedTreatment", tokens: 15},
    { eventName: "Compliance", tokens: 20},
    { eventName: "TimelyRefill", tokens: 5},
]

const addTokens = async (req, res) => {
    try {
        const id = req.params.id;

        // Identify which event was received.
        const eventName = req.body.eventName;

        // search through array to determine which tokens to add. 
        const result = await addTokensHelper(id, eventName)

        // add tokens and save in db
        if (result.success) {
            return res.status(200).json({ message: `Patient tokens added`});
        } else {
            return res.status(400).json({ message: result.message});
        }

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const addTokensHelper = async (patientID, eventName) => {
    try {
        const foundPatient = await patient.findById(patientID);
        if (!foundPatient) {
            return {success: false, message: "Patient not found"};
        }
        const eventDef = eventsConfig.find((e) => e.eventName === eventName);

        if (eventDef) {
            foundPatient.tokens += eventDef.tokens;
            await foundPatient.save();
            return {success: true, tokens: foundPatient.tokens}
        } else {
            return {success: false, message: "Event not found"};
        }
    } catch (err) {
        return { success: false, message: err.message};
    }
}

const resetTokens = async (req, res) => {
    try {
        // get all patients
        const allPatients = await patient.find();

        // go through each patient and set to zero
        for (const p of allPatients) {
            if (p.tokens) {
                p.tokens = 0;
            }
            // creates a tokens field if patient doesn't already have in DB
            await p.save();
        }

        return res.status(200).json({ message: 'All patient tokens reset to zero.'})
    } catch (error) {
        return res.status(500).json({ message: error.message})
    }
}



/*
    This method returns an array of numbers corresponding to the vials from the protocol and in patient bottles
*/
const findPercentMaintenance = async (req, res) => {    
    try {
        const patientID = req.params.patientID
        const foundPatient = await patient.findById(patientID);
        if (!foundPatient) {
            return res.status(404).json({ message: `Patient not found ${patientID}`});
        }

        const foundProtocol = await protocols.findOne( {practiceID: foundPatient.practiceID} );
        if (!foundProtocol) {
            return res.status(404).json({ message: `Protocol not found.`});
        }

        const lastTreatment = await treatment.findOne({patientID}).sort({_id: -1}).limit(1)
        if (!lastTreatment) {
            return res.status(200).json({ array: [0, 0, 0], message: 'Patient has no recorded treatments'});
        }

        let array = [];
        for(let i = 0; i < foundProtocol.bottles.length; i++){
            let bottleName = foundProtocol.bottles[i].bottleName;
            let curBottle = lastTreatment.bottles.find((b) => {
                return bottleName === b.nameOfBottle.replace(/^"(.*)"$/, '$1');
            });
            let mBottle = foundPatient.maintenanceBottleNumber.find((b) => {
                return bottleName === b.nameOfBottle.replace(/^"(.*)"$/, '$1');
            });
            if (!curBottle | !mBottle ) {
                array.push(0);
                continue;
            }
            // Total Calc
            let totalBottleSteps = mBottle.maintenanceNumber;
            let totalVolumeSteps = Math.ceil(( foundProtocol.nextDoseAdjustment.maxInjectionVol - foundProtocol.nextDoseAdjustment.startingInjectionVol ) / foundProtocol.nextDoseAdjustment.injectionVolumeIncreaseInterval) + 1;
            let totalSteps = totalBottleSteps * totalVolumeSteps;
            // Current Calc
            let curBottleSteps = (curBottle.currBottleNumber == 'M' ? mBottle.maintenanceNumber : curBottle.currBottleNumber);
            let curVolumeSteps = Math.ceil(( curBottle.injVol - foundProtocol.nextDoseAdjustment.startingInjectionVol ) / foundProtocol.nextDoseAdjustment.injectionVolumeIncreaseInterval ) + 1;
            let curSteps = Math.max(curBottleSteps-1, 0) * totalVolumeSteps + curVolumeSteps;
            // console.log(`${totalSteps} = ${totalBottleSteps} * ${totalVolumeSteps}`);
            // console.log(`${curSteps} <= ${curBottleSteps} : ${curVolumeSteps}`);
            array.push(Math.round(curSteps / totalSteps * 100)); //2 Decimal places
        }

        return res.status(200).json({array, message: `Array of maintenance sent`});
    } catch(error){
        console.log(error);
        return res.status(500).json({ message: `Error`});
    }
}
/*
const findPercentMaintenance = async (req, res) => {
    try{

        const patientID = req.params.patientID
        const foundPatient = await patient.findById(patientID);
        if (!foundPatient) {
            return res.status(404).json({ message: `Patient not found ${patientID}`});
        }

        const foundProtocol = await protocols.findOne( {practiceID: foundPatient.practiceID} );
        //console.log(JSON.stringify(foundPatient.practiceID));
        if (!foundProtocol) {
            return res.status(404).json({ message: `Protocol not found.`});
        }

        //Find the last treatment of the patient 
        const treatmentLength = foundPatient.treatments.length;

        let patientNextTreatmentID = null;
        let patientLastTreatmentID = null;
        let patientSecondToLastTreatmentID = null;


        // Needs to catch out of bounds errors
        try {
            patientNextTreatmentID = foundPatient.treatments[treatmentLength - 1];
            patientLastTreatmentID = foundPatient.treatments[treatmentLength - 2];
            patientSecondToLastTreatmentID = foundPatient.treatments[treatmentLength - 3];
        } catch (error) {
            return res.status(201).json({ message: 'Treatments not added correctly.'});
        }
    
        
        const nextTreatment = await treatment.findById(patientNextTreatmentID);
        let lastTreatment = await treatment.findById(patientLastTreatmentID);
        let secondToLastTreatment = await treatment.findById(patientSecondToLastTreatmentID);
        if(nextTreatment.attended == true){
            secondToLastTreatment = lastTreatment;
            lastTreatment = nextTreatment;
        }
        let array = [];

        if(treatmentLength < 3){
            for( let i = 0; i < lastTreatment.bottles.length; i ++){
                array.push(0);
            }
            return res.status(201).json({array, message: 'Array of 0\'s sent. Not enough treatment data.'});
            //return res.status(404).json({ message: `Not enough patient data`});
        }

        if(lastTreatment.attended == true && secondToLastTreatment.attended == true){
            for(let i = 0; i < lastTreatment.bottles.length; i++){

                let lastInjVol = lastTreatment.bottles[i].injVol;
                let secLastInjVol = secondToLastTreatment.bottles[i].injVol;
                let lastDoseAdvancement = lastTreatment.bottles[i].currentDoseAdvancement;
                let secLastDoseAdvancement = secondToLastTreatment.bottles[i].currentDoseAdvancement;
                let lastTreatmentBN = lastTreatment.bottles[i].currBottleNumber;
                let secLastTreatmentBN = secondToLastTreatment.bottles[i].currBottleNumber;
                let ptMaintBottle = foundPatient.maintenanceBottleNumber[i].maintenanceNumber;
                let injVolIncreaseInterval = foundProtocol.nextDoseAdjustment.injectionVolumeIncreaseInterval;
    
                const totalInjCountForMaint = (foundProtocol.nextDoseAdjustment.maxInjectionVol / injVolIncreaseInterval) * ptMaintBottle;
    
                if(lastInjVol >= (Math.round((secLastInjVol + injVolIncreaseInterval)*100)/100)){
                    lastDoseAdvancement = secLastDoseAdvancement + 1;
                    array.push(Math.round(lastDoseAdvancement / totalInjCountForMaint * 100)/100);
                }
                else{
                    if(lastInjVol == secLastInjVol){
                        lastDoseAdvancement = secLastDoseAdvancement;
                        array.push(Math.round(lastDoseAdvancement / totalInjCountForMaint * 100)/100);
                    }
                    else{
                        if((parseInt(lastTreatmentBN) > secLastTreatmentBN) && (parseInt(lastTreatmentBN) < ptMaintBottle))
                        {
                            lastDoseAdvancement = secLastDoseAdvancement + 1;
                            array.push(Math.round(lastDoseAdvancement / totalInjCountForMaint * 100)/100);
                        }
                        else{
                            if(lastTreatmentBN == "M"){
                                lastDoseAdvancement = totalInjCountForMaint;
                                array.push(Math.round(lastDoseAdvancement / totalInjCountForMaint * 100)/100);
                            }
                            else{
                                if((lastDoseAdvancement - ((Math.round((secLastInjVol - lastInjVol)*100)/100) / injVolIncreaseInterval)) < 1)
                                {
                                    lastDoseAdvancement = 1;
                                    array.push(Math.round(lastDoseAdvancement / totalInjCountForMaint * 100)/100);
                                }
                                else{
                                    lastDoseAdvancement = (lastDoseAdvancement - ((Math.round((secLastInjVol - lastInjVol)*100)/100) / injVolIncreaseInterval));
                                    array.push(Math.round(lastDoseAdvancement / totalInjCountForMaint * 100)/100);
                                }
                            }
                        }
                    }
                }
            }
        }
        else{

            for( let i = 0; i < lastTreatment.bottles.length; i ++){
                array.push(0);
            }
            return res.status(201).json({array, message: 'Array of 0\'s sent. Next Treatment not calculated.'});
        }

        //Sending over array of percent maintenance for each vial in the same order as stored in treatment
        return res.status(200).json({array, message: `Array of maintenance sent`});
    }
    catch(error){
        console.log(error);
        return res.status(400).json({ message: `Error`});
    }
}
*/

/*
    Body of medications sent as json like this:

    [{
        medication: {
            name:
            dose:
            frequency:
        },
        ...
    }]
*/


const updateAllergyMedication = async (req, res) => {
    try{
        const query = { _id: req.params.patientID };
        const update = { medications: req.body.medications };
        const newPatient = await patient.findOneAndUpdate(query, update, {new: true});

        return res.status(200).json({patient: newPatient});
    }
    catch(error){
        return res.status(400).json({ message: error.message})
    }
}

// Get medication by id
const getAllergyMedication = async (req, res) => {
    try {
        const id = req.params.id;
        const foundPatient = await patient.findById(id);
        if (foundPatient) {
            return res.status(200).json(foundPatient.allergyMedication);
        } else {
            return res.status(404).json({ message: `Patient not found: ${id}` });
        }
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

const updateLLR = async (req, res) => {
    try {
        const { patientID, date, bottleName, injLLR } = req.body;
        //const treatmentToUpdate = await treatment.findOneAndUpdate({patientID: patientID}, {...req.body} );
        const treatmentToUpdate = await treatment.findOne(
            { patientID: patientID, date: date }
        );
        const treatmentIndex = treatmentToUpdate.bottles.findIndex(bottleName == bottleName);
        treatmentToUpdate.bottles[treatmentIndex].injLLR = injLLR;
        await treatmentToUpdate.save();
        res.status(200).json({ message: 'Successful update'});
        
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

const updateMaintenanceBottleNums = async (req, res) => {
    try{
        const query = { _id: req.params.patientID };
        const update = { maintenanceBottleNumber: req.body };
        let updated = await patient.findOneAndUpdate(query, update, {new: true});
        
        return res.status(200).json({patient: updated})
    }
    catch(error){
        return res.status(400).json({ message: error.message})
    }
}

// required for const functions
module.exports = {
    addPatient,
    addPatientToProvider,
    getAllPatientsHelper,
    getPatientsByPractice,
    getPatient,
    checkEmail,
    addTokens,
    resetTokens,
    deletePatient,
    updateAllergyMedication,
    findPercentMaintenance,
    getAllergyMedication,
    updateMaintenanceBottleNums,
    updateLLR,
    findPatient,
    addTokensHelper
}
