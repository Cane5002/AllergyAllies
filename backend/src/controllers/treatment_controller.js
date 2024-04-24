const treatment = require('../Models/treatment');
const patient = require('../Models/patient');
const protocol = require('../Models/protocols');
const practice = require('../Models/practice');


exports.firstTreatment = async (req, res) => {
    try {
        
        const patientID = req.params.id
        const earliest = await treatment.find({patientID: patientID}).sort({date: 1}).limit(1)

        return res.status(200).json(earliest)
    }
    catch (err) {
        return res.status(400).json({message: err})
    }
}

exports.getDaysSinceLastTreatment = async (req, res) => {

    const { patientID } = req.body;

    const patientToFind = await patient.findById(patientID);
    if (!patientToFind) {
        res.status(404).json({ message: "Patient not found" });
    }

    const treatmentLength = patientToFind.treatments.length;
    let patientLastTreatmentID = patientToFind.treatments[treatmentLength - 1];
    let lastTreatment = await treatment.findById(patientLastTreatmentID);

    if(lastTreatment.attended == false){
        patientLastTreatmentID = patientToFind.treatments[treatmentLength - 2];
        lastTreatment = await treatment.findById(patientLastTreatmentID);
    }

    const today = new Date();
    const lastTreatmentDate = new Date(lastTreatment.date);
    const dateDifference = (today.getTime() - lastTreatmentDate.getTime()) / (1000 * 3600 * 24);

    return dateDifference;
}

exports.getLastTreatment = async (req, res) => {
    try {
        
        const patientID = req.params.id
        const latest = await treatment.find({patientID: patientID}).sort({_id: -1}).limit(1)

        return res.status(200).json(latest)
    }
    catch (err) {
        return res.status(400).json({message: err})
    }
}

exports.getSecondLastTreatment = async (req, res) => {
    try {
        
        const patientID = req.params.id
        const latest = await treatment.find({patientID: patientID}).sort({_id: -1}).limit(2)
        return res.status(200).json([latest.at(1)])
    }
    catch (err) {
        return res.status(400).json({message: err})
    }
}

// Post method
exports.addTreatment = async (req, res) => {
    try {

        //This method is called when a patient creates an account creating an empty treatment that needs to be updated
        const { patientID, practiceID, date, bottles} = req.body;

        const patientToFind = await patient.findById(patientID);
        if (patientToFind == null) {
            return res.status(404).json({ message: "Patient not found" });
        }

        const findProtocol = await protocol.findOne({ practiceID: practiceID });
        if (findProtocol == null) {
            return res.status(404).json({ message: "Protocol not found" });
        }
        
        //function that takes in a date from MongoDB and converts it into readable format
        function formatDate(mongoDate){

            //convert into javascript Date object
            const javascriptDate = new Date(mongoDate);
            //standardize timezone
            const utcDate = new Date(javascriptDate.getTime() + javascriptDate.getTimezoneOffset() * 60 * 1000);
            return utcDate.toLocaleDateString('en-US', {
                year: '2-digit',
                month: '2-digit',
                day: '2-digit',
            });
    
        }

        const findPractice = await practice.findById(practiceID);

        const data = new treatment({
            nameOfPractice: findPractice.practiceName,  
            patientLastName: patientToFind.lastName, 
            patientFirstName: patientToFind.firstName, 
            patientID: patientID,
            date: date, 
            bottles: bottles,
            attended: true,
        });
        await data.save();

        //Add patient treatment data to end of array
        patientToFind.treatments.push(data.id);

        await patient.findOneAndUpdate({patientID}, patientToFind);

        return res.status(201).json(data);
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: error.message });
    }
}


// Get ALL treatments across patients
exports.getAllTreatments = async (req, res) => {
    try {
        const data = await treatment.find();
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Get ALL treatments across patients
exports.getAllTreatmentsByID = async (req, res) => {
    try {
        const patientID = req.params.patientID
        const data = await treatment.find({patientID: patientID});
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}


// Get treatment by patientID and treatment date

exports.getTreatment = async (req, res) => {
    try {
    const { patientID, date } = req.body;

        const data = await treatment.findOne({ patientID: patientID, date: date });
        if (data == null) {
            res.status(404).json({ message: `${error}`});
        }
        else {
            console.log(data);
            res.status(200).json({data});
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Delete by patientID and treatment date
exports.deleteTreatment = async (req, res) => {
    try {
        const { patientID, date } = req.body;

        const treatmentToDelete = await treatment.findOne({ patientID: patientID, date: date });
        if (!treatmentToDelete) {
            return res.status(404).json({ message: "Treatment not found" });
        }

        const findPatient = await patient.findById(patientID);
        const indexToDelete = findPatient.treatments.findIndex(x => x == treatmentToDelete._id);
        if(indexToDelete != -1){
            findPatient.treatments.splice(indexToDelete, 1);
        }
        else{
            return res.status(201).json({message: "Treatment not found for patient."})
        }

        await findPatient.save();
        await treatment.findByIdAndDelete(treatmentToDelete._id);
        return res.status(200).json({ message: `Treatment has been deleted.` });
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
}


/*
    This update is for a single vial in the panel of bottles, when there is an adverse reaction, should be done 
    before next treatment is called.

    Some of this information can be removed and changed
*/
exports.updateAdverseTreatment = async (req, res) => {
    try {
        const { patientID, date, bottleName, injVol, injDilution, injLLR, currBottleNumber } = req.body;
        const treatmentToUpdate = await treatment.findOne( { patientID: patientID, date: date} );
        const treatmentIndex = treatmentToUpdate.bottles.findIndex(x => x.nameOfBottle == bottleName);
        console.log(treatmentToUpdate);
        treatmentToUpdate.bottles[treatmentIndex].injVol = injVol;
        treatmentToUpdate.bottles[treatmentIndex].injLLR = injLLR;
        treatmentToUpdate.bottles[treatmentIndex].injDilution = injDilution;
        treatmentToUpdate.bottles[treatmentIndex].currBottleNumber = currBottleNumber;
        treatmentToUpdate.bottles[treatmentIndex].adverseReaction = true;
        treatmentToUpdate.bottles[treatmentIndex].needsVialTest = true;
        treatmentToUpdate.bottles[treatmentIndex].currentDoseAdvancement = treatmentToUpdate.bottles[treatmentIndex].currentDoseAdvancement - 1;
        
        // treatmentToUpdate.bottles[treatmentIndex].expirationDate = expirationDate;
        // treatmentToUpdate.bottles[treatmentIndex].needsRefill = needsRefill;
        await treatmentToUpdate.save();
        res.status(200).json({ message: 'Successful update'});
        
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

/*
    This update is after a successful treatment given a patientID and the date of the treatment

    Array should look like this:
    [
        {
            "bottleName": "one",
            "injVol": 123,
            "injLLR": 123,
            "injDilution": 0,
            "currBottleNumber": 2,
            "expirationDate": "2023-12-02T05:00:00.000+00:00",
            "locationOfInjection": "Left Arm"
            "needsRefill": false
        }, ...
    ]
*/

exports.updateSuccessfulTreatment = async (req, res) => {
    try {
        
        const { patientID, date, arrayOfBottles } = req.body;
        //This will update a specific appointment with the given date
        let treatmentToUpdate = await treatment.findOne( { patientID: patientID, date: date} );

        let patientToFind = await patient.findById(patientID);
        let findProtocol = await protocol.findOne({practiceID: patientToFind.practiceID});
        const treatmentLength = patientToFind.treatments.length;
        let patientLastTreatmentID = patientToFind.treatments[treatmentLength - 1];
        let newDate = new Date(date);

        const nextAppointmentDate = new Date(date);
        nextAppointmentDate.setDate(nextAppointmentDate.getDate() + parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range1.days)));
        nextAppointmentDate.setHours(0,0,0,0);

        patientToFind.lastApptDateBeforeAttrition = nextAppointmentDate;

        if(!treatmentToUpdate){
            //This looks for the next treatment
            treatmentToUpdate = await treatment.findById(patientLastTreatmentID);
            if(treatmentToUpdate){
                if(newDate.getTime() > treatmentToUpdate.date.getTime()){
                    patientToFind.missedAppointmentCount = patientToFind.missedAppointmentCount + 1;
                }
            }
            else{
                return res.status(400).json({ message: "Treatment not found" });
            }
        }

        let treatmentIndex = 0;
        
        for( let i = 0; i < arrayOfBottles.length; i++){
            treatmentIndex = treatmentToUpdate.bottles.findIndex(x => x.nameOfBottle == arrayOfBottles[i].nameOfBottle);
            treatmentToUpdate.bottles[treatmentIndex].injVol = arrayOfBottles[i].injVol;
            treatmentToUpdate.bottles[treatmentIndex].injDilution = arrayOfBottles[i].injDilution;
            treatmentToUpdate.bottles[treatmentIndex].currBottleNumber = arrayOfBottles[i].currBottleNumber;
            treatmentToUpdate.bottles[treatmentIndex].currentDoseAdvancement = treatmentToUpdate.bottles[treatmentIndex].currentDoseAdvancement + 1;

            treatmentToUpdate.bottles[treatmentIndex].locationOfInjection = arrayOfBottles[i].locationOfInjection;
        }

        treatmentToUpdate.date = date;
        treatmentToUpdate.attended = true;

        await treatmentToUpdate.save();
        await patientToFind.save();
        res.status(200).json({ message: 'Successful update'});
        
        
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

//update treatment according to calculations, this is called right before a calculation and 
exports.nextTreatment = async(req, res) => {
    try{
        const { patientID, practiceID } = req.body;

        //Pass in patientID and practiceID
        const id = patientID;
        const pracID = practiceID;

        const patientToFind = await patient.findById(id);
        if (!patientToFind) {
            res.status(404).json({ message: "Patient not found" });
        }

        const findProtocol = await protocol.findOne({ practiceID: pracID });
        if (!findProtocol) {
            res.status(404).json({ message: "Protocol not found" });
        }


        //Find the last treatment of the patient 
        const treatmentLength = patientToFind.treatments.length;
        const patientLastTreatmentID = patientToFind.treatments[treatmentLength - 1];
        const lastTreatment = await treatment.findById(patientLastTreatmentID);

        if(lastTreatment.attended == false){
            return res.status(201).json({ message: "You cannot determine the next treatment without a previous successful injection. Please update last injection." });
        }

        //Returns current date in milliseconds
        const today = new Date();
        const lastTreatmentDate = new Date(lastTreatment.date);
        const dateDifference = (today.getTime() - lastTreatmentDate.getTime()) / (1000 * 3600 * 24);

        //Return next appointment date
        const nextAppointmentDate = new Date(lastTreatmentDate);
        nextAppointmentDate.setDate(nextAppointmentDate.getDate() + parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range1.days)));
        nextAppointmentDate.setHours(0,0,0,0);


        const data = new treatment({
            nameOfPractice: lastTreatment.nameOfPractice, 
            patientLastName: lastTreatment.patientLastName, 
            patientFirstName: lastTreatment.patientFirstName, 
            patientID: lastTreatment.patientID, 
            date: formatDate(nextAppointmentDate), 
            attended: false
        });

        patientToFind.treatments.push(data._id);
        await patientToFind.save();

        //Determine how many antigens they are using
        const patientBottleCount = lastTreatment.bottles.length;

        let newLastVialTestMap = new Map();
        let newNextVialTestMap = new Map();

        //function that takes in a date from MongoDB and converts it into readable format
        function formatDate(mongoDate){

            //convert into javascript Date object
            const javascriptDate = new Date(mongoDate);
            //standardize timezone
            const utcDate = new Date(javascriptDate.getTime() + javascriptDate.getTimezoneOffset() * 60 * 1000);
            return utcDate.toLocaleDateString('en-US', {
                year: '2-digit',
                month: '2-digit',
                day: '2-digit',
            });
    
        }

        //Set respective vial's values
        for(let i = 0; i < patientBottleCount; i++){
            let antigenName = lastTreatment.bottles[i].nameOfBottle;
            let antigenInjVol = lastTreatment.bottles[i].injVol;
            let antigenDil = lastTreatment.bottles[i].injDilution;
            let antigenLLR = lastTreatment.bottles[i].injLLR;
            let antigenCurrBottleNumber = lastTreatment.bottles[i].currBottleNumber;
            let antigenMaintenanceBN = patientToFind.maintenanceBottleNumber[i].maintenanceNumber;

            let newInjVol = InjVolumeCalc(antigenCurrBottleNumber, antigenLLR, antigenInjVol, antigenDil, antigenMaintenanceBN);
            let newDilAdjustment = DilAdjustmentCalc(antigenLLR, antigenInjVol, antigenDil, antigenName);

            //New Bottle Numbers for next treatment is 999, then maintenance
            let newBottleNumber = BottleNumberCalc(antigenCurrBottleNumber, antigenLLR, antigenInjVol, antigenDil, antigenMaintenanceBN, antigenName);
            let stringTemp = "";
            let triggerVialTest = false;
            let newExpirationDate = new Date(lastTreatment.bottles[i].expirationDate);
            if(newBottleNumber == 999){
                stringTemp = "M";
            }
            else{
                stringTemp = parseInt(newBottleNumber);
            }
            if(newBottleNumber != parseInt(antigenCurrBottleNumber)){
                triggerVialTest = true;
                let newDate = new Date(today);
                newExpirationDate = new Date(newDate.setMonth(newDate.getMonth()+ findProtocol.bottles[i].shelfLife));
            }

            let lastVialTestValues = lastTreatment.lastVialTests.get(antigenName).values;

            newLastVialTestMap.set(antigenName, {values: lastVialTestValues});
            
            let newVialValues = {dilution: 0, bottleNumber: "0", whealSize: 0};
            NextVialTestDilution(newVialValues, antigenLLR, antigenInjVol, antigenDil);
            NextVialTestBottleNumber(newVialValues, antigenLLR, antigenInjVol, antigenDil, antigenCurrBottleNumber, antigenMaintenanceBN);

            data.bottles.push({
                nameOfBottle: antigenName,
                injVol: (Math.round(newInjVol * 100) / 100),
                injDilution: (Math.round(newDilAdjustment * 100) / 100),
                injLLR: 0,
                currBottleNumber: stringTemp,
                currentDoseAdvancement: lastTreatment.bottles[i].currentDoseAdvancement,
                adverseReaction: false,
                locationOfInjection: "",
                needsVialTest: triggerVialTest,
                needsRefill: false,
                expirationDate: formatDate(newExpirationDate)
            });

            newNextVialTestMap.set(antigenName, {values: newVialValues});
        }
        data.lastVialTests = newLastVialTestMap;
        data.nextVialTests = newNextVialTestMap;

        const dataToSave = await data.save();
        res.status(200).json(dataToSave);


        /*
            Calculation for next Vial Test dilution
        */
        function NextVialTestDilution(values, lastTreatmentLLR, lastTreatmentInj, lastTreatmentDil){

            if(lastTreatmentInj >= parseFloat(JSON.stringify(findProtocol.nextDoseAdjustment.maxInjectionVol))){
                if((lastTreatmentDil <= 0) && (lastTreatmentLLR < parseFloat(JSON.stringify(findProtocol.vialTestReactionAdjustment.whealLevelForAdjustment)))){
                    values.dilution = 0;
                    return;
                }
                else{
                    if(lastTreatmentDil > 0){
                        if((lastTreatmentDil - 1) <= 0){
                            return;
                        }
                        else{
                            values.dilution = (lastTreatmentDil - 1);
                            return;
                        }
                    }
                    else{
                        if(lastTreatmentLLR >= parseFloat(JSON.stringify(findProtocol.vialTestReactionAdjustment.whealLevelForAdjustment))){
                            values.dilution = (lastTreatmentDil + 1);
                            return;
                        }
                        else{
                            return;
                        }
                    }
                }
            }
            else{
                return;
            }
        }

        /*
            Calculation for next Vial Test Bottle Number
        */
        function NextVialTestBottleNumber(values, lastTreatmentLLR, lastTreatmentInj, lastTreatmentDil, lastTreatmentBN, ptMaintBottle){

            if(lastTreatmentInj >= parseFloat(JSON.stringify(findProtocol.nextDoseAdjustment.maxInjectionVol))){
                if(lastTreatmentLLR >= parseFloat(JSON.stringify(findProtocol.vialTestReactionAdjustment.whealLevelForAdjustment))){
                    values.bottleNumber = lastTreatmentBN;
                    return;
                }
                else{
                    if(lastTreatmentBN == "M"){
                        values.bottleNumber = "M";
                        return;
                    }
                    else{
                        if((parseInt(lastTreatmentBN) + 1) >= ptMaintBottle){
                            values.bottleNumber = "M";
                            return;
                        }
                        else{
                            if(lastTreatmentDil > 0){
                                values.bottleNumber = lastTreatmentBN;
                                return;
                            }
                            else{
                                values.bottleNumber = (parseInt(lastTreatmentBN) + 1).toString();
                                return;
                            }
                        }
                    }
                }
            }
            else{
                values.bottleNumber = "0";
                return;
            }
        }


        /*
            Calculation for injection volume of next treatment.
        */
        function InjVolumeCalc(lastTreatmentBN, lastTreatmentLLR, lastTreatmentInj, lastTreatmentDil, ptMaintBottle){

            let newTreatmentInjVol = 0;

            if(lastTreatmentBN == "M" && lastTreatmentLLR < parseFloat(JSON.stringify(findProtocol.largeReactionsDoseAdjustment.whealLevelForAdjustment)) 
                && parseFloat(JSON.stringify(lastTreatment.vialTest.whealSize)) < parseFloat(JSON.stringify(findProtocol.vialTestReactionAdjustment.whealLevelForAdjustment))
                && dateDifference <= parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range1.days)) /*findProtocol.nextDoseAdjustment.injectionInterval*/)
            {
                newTreatmentInjVol = parseFloat(JSON.stringify(findProtocol.nextDoseAdjustment.maxInjectionVol));
                return newTreatmentInjVol;
            }
            else if(lastTreatmentInj >= parseFloat(JSON.stringify(findProtocol.nextDoseAdjustment.maxInjectionVol)) 
                && dateDifference < parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range1.days))
                && lastTreatmentLLR < parseFloat(JSON.stringify(findProtocol.largeReactionsDoseAdjustment.whealLevelForAdjustment)) 
                && lastTreatmentBN != "M" && parseInt(lastTreatmentBN) < ptMaintBottle)
            {
                    newTreatmentInjVol = parseFloat(JSON.stringify(findProtocol.nextDoseAdjustment.startingInjectionVol));
                    return newTreatmentInjVol;
            }
            else if(lastTreatmentLLR >= parseFloat(JSON.stringify(findProtocol.largeReactionsDoseAdjustment.whealLevelForAdjustment))){
                if((lastTreatmentInj - parseFloat(JSON.stringify(findProtocol.largeReactionsDoseAdjustment.decreaseInjectionVol))) < parseFloat(JSON.stringify(findProtocol.nextDoseAdjustment.startingInjectionVol))){
                    newTreatmentInjVol = parseFloat(JSON.stringify(findProtocol.nextDoseAdjustment.startingInjectionVol));
                    return newTreatmentInjVol;
                }else{
                    newTreatmentInjVol = (lastTreatmentInj - parseFloat(JSON.stringify(findProtocol.largeReactionsDoseAdjustment.decreaseInjectionVol)));
                    return newTreatmentInjVol;
                }
            }
            else{
                if(dateDifference >= parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range4.days))){
                    if((lastTreatmentInj - parseFloat(JSON.stringify(findProtocol.missedDoseAdjustment.range4.injectionVolumeDecrease))) < parseFloat(JSON.stringify(findProtocol.nextDoseAdjustment.startingInjectionVol))){
                        newTreatmentInjVol = parseFloat(JSON.stringify(findProtocol.nextDoseAdjustment.startingInjectionVol));
                        return newTreatmentInjVol;
                    }
                    else{
                        newTreatmentInjVol = (lastTreatmentInj - parseFloat(JSON.stringify(findProtocol.missedDoseAdjustment.range4.injectionVolumeDecrease)));
                        return newTreatmentInjVol;
                    }
                }
                else if(dateDifference >= parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range3.days))){
                    if((lastTreatmentInj - parseFloat(JSON.stringify(findProtocol.missedDoseAdjustment.range3.injectionVolumeDecrease))) < parseFloat(JSON.stringify(findProtocol.nextDoseAdjustment.startingInjectionVol))){
                        newTreatmentInjVol = parseFloat(JSON.stringify(findProtocol.nextDoseAdjustment.startingInjectionVol));
                        return newTreatmentInjVol;
                    }
                    else{
                        newTreatmentInjVol = (lastTreatmentInj - parseFloat(JSON.stringify(findProtocol.missedDoseAdjustment.range3.injectionVolumeDecrease)));
                        return newTreatmentInjVol;
                    }
                }
                else if(dateDifference >= parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range2.days))){
                    if((lastTreatmentInj - parseFloat(JSON.stringify(findProtocol.missedDoseAdjustment.range2.injectionVolumeDecrease))) < parseFloat(JSON.stringify(findProtocol.nextDoseAdjustment.startingInjectionVol))){
                        newTreatmentInjVol = parseFloat(JSON.stringify(findProtocol.nextDoseAdjustment.startingInjectionVol));
                        return newTreatmentInjVol;
                    }
                    else{
                        newTreatmentInjVol = (lastTreatmentInj - parseFloat(JSON.stringify(findProtocol.missedDoseAdjustment.range2.injectionVolumeDecrease)));
                        return newTreatmentInjVol;
                    }
                }
                else if(dateDifference >= parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range1.days))){
                    if((lastTreatmentInj - parseFloat(JSON.stringify(findProtocol.missedDoseAdjustment.range1.injectionVolumeDecrease))) < parseFloat(JSON.stringify(findProtocol.nextDoseAdjustment.startingInjectionVol))){
                        newTreatmentInjVol = parseFloat(JSON.stringify(findProtocol.nextDoseAdjustment.startingInjectionVol));
                        return newTreatmentInjVol;
                    }
                    else{
                        newTreatmentInjVol = (lastTreatmentInj - parseFloat(JSON.stringify(findProtocol.missedDoseAdjustment.range1.injectionVolumeDecrease)));
                        return newTreatmentInjVol;
                    }
                }
                else{
                    if((lastTreatmentInj + parseFloat(JSON.stringify(findProtocol.nextDoseAdjustment.injectionVolumeIncreaseInterval))) > parseFloat(JSON.stringify(findProtocol.nextDoseAdjustment.maxInjectionVol))){
                        if(lastTreatmentDil > 0){
                            newTreatmentInjVol = parseFloat(JSON.stringify(findProtocol.nextDoseAdjustment.startingInjectionVol));
                            return newTreatmentInjVol;
                        }
                        else{
                            if(lastTreatmentBN == "M"){
                                newTreatmentInjVol = parseFloat(JSON.stringify(findProtocol.nextDoseAdjustment.maxInjectionVol));
                                return newTreatmentInjVol;
                            }
                            else{
                                if(parseInt(lastTreatmentBN) >= ptMaintBottle){ /* == to >= */
                                    newTreatmentInjVol = parseFloat(JSON.stringify(findProtocol.nextDoseAdjustment.maxInjectionVol));
                                    return newTreatmentInjVol;
                                }
                                else{
                                    newTreatmentInjVol = parseFloat(JSON.stringify(findProtocol.nextDoseAdjustment.startingInjectionVol));
                                    return newTreatmentInjVol;
                                }
                            }
                        }
                    }
                    else{
                        newTreatmentInjVol = (lastTreatmentInj + parseFloat(JSON.stringify(findProtocol.nextDoseAdjustment.injectionVolumeIncreaseInterval)));
                        return newTreatmentInjVol;
                    }
                }
            }
        }


        /*
            Calculation of next dilution
        */
        function DilAdjustmentCalc(lastTreatmentLLR, lastTreatmentInj, lastTreatmentDil, vialTestKey){

            let newTreatmentDilVol = 0;

            if(lastTreatmentInj >= parseFloat(JSON.stringify(findProtocol.nextDoseAdjustment.maxInjectionVol))){
                if(parseFloat(JSON.stringify(lastTreatment.lastVialTests.get(vialTestKey).values.whealSize)) >= parseFloat(JSON.stringify(findProtocol.vialTestReactionAdjustment.whealLevelForAdjustment))){
                    newTreatmentDilVol = (lastTreatmentDil + parseFloat(JSON.stringify(findProtocol.vialTestReactionAdjustment.adjustVialConcentration)));
                    return newTreatmentDilVol;
                }
                else{
                    if(lastTreatmentDil == 0){
                        newTreatmentDilVol = 0;
                        return newTreatmentDilVol;
                    }
                    else{  
                        if((lastTreatmentDil - parseFloat(JSON.stringify(findProtocol.vialTestReactionAdjustment.adjustVialConcentration))) <= 0){
                            newTreatmentDilVol = 0;
                            return newTreatmentDilVol;
                        }
                        else{
                            newTreatmentDilVol = (lastTreatmentDil - parseFloat(JSON.stringify(findProtocol.vialTestReactionAdjustment.adjustVialConcentration)));
                            return newTreatmentDilVol;
                        }
                    }
                }
            }
            else{
    
                if(lastTreatmentLLR >= parseFloat(JSON.stringify(findProtocol.largeReactionsDoseAdjustment.whealLevelForAdjustment))){
                    if(lastTreatmentDil == 0){
                        newTreatmentDilVol = parseFloat(JSON.stringify(findProtocol.largeReactionsDoseAdjustment.adjustVialConcentration));
                        return newTreatmentDilVol;
                    }
                    else{
                        newTreatmentDilVol = (lastTreatmentDil + parseFloat(JSON.stringify(findProtocol.largeReactionsDoseAdjustment.adjustVialConcentration)));
                        return newTreatmentDilVol;
                    }
                }
                else{
                    if(dateDifference >= parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range4.days))){
                        if(lastTreatmentDil == 0){
                            if(parseFloat(JSON.stringify(findProtocol.missedDoseAdjustment.range4.decreaseVialConcentration)) <= 0){
                                newTreatmentDilVol = 0;
                                return newTreatmentDilVol;
                            }
                            else{
                                newTreatmentDilVol = parseFloat(JSON.stringify(findProtocol.missedDoseAdjustment.range4.decreaseVialConcentration));
                                return newTreatmentDilVol;
                            }
                        }
                        else{
                            newTreatmentDilVol = (lastTreatmentDil + parseFloat(JSON.stringify(findProtocol.missedDoseAdjustment.range4.decreaseVialConcentration)));
                            return newTreatmentDilVol;
                        }
                    }
                    else if(dateDifference >= parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range3.days))){
                        if(lastTreatmentDil == 0){
                            if(parseFloat(JSON.stringify(findProtocol.missedDoseAdjustment.range3.decreaseVialConcentration)) <= 0){
                                newTreatmentDilVol = 0;
                                return newTreatmentDilVol;
                            }
                            else{
                                newTreatmentDilVol = parseFloat(JSON.stringify(findProtocol.missedDoseAdjustment.range3.decreaseVialConcentration));
                                return newTreatmentDilVol;
                            }
                        }
                        else{
                            newTreatmentDilVol = (lastTreatmentDil + parseFloat(JSON.stringify(findProtocol.missedDoseAdjustment.range3.decreaseVialConcentration)));
                            return newTreatmentDilVol;
                        }
                    }
                    else if(dateDifference >= parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range2.days))){
                        if(lastTreatmentDil == 0){
                            if(parseFloat(JSON.stringify(findProtocol.missedDoseAdjustment.range2.decreaseVialConcentration)) <= 0){
                                newTreatmentDilVol = 0;
                                return newTreatmentDilVol;
                            }
                            else{
                                newTreatmentDilVol = parseFloat(JSON.stringify(findProtocol.missedDoseAdjustment.range2.decreaseVialConcentration));
                                return newTreatmentDilVol;
                            }
                        }
                        else{
                            newTreatmentDilVol = (lastTreatmentDil + parseFloat(JSON.stringify(findProtocol.missedDoseAdjustment.range2.decreaseVialConcentration)));
                            return newTreatmentDilVol;
                        }
                    }
                    else if(dateDifference >= parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range1.days))){
                        if(lastTreatmentDil == 0){
                            if(parseFloat(JSON.stringify(findProtocol.missedDoseAdjustment.range1.decreaseVialConcentration)) <= 0){
                                newTreatmentDilVol = 0;
                                return newTreatmentDilVol;
                            }
                            else{
                                newTreatmentDilVol = parseFloat(JSON.stringify(findProtocol.missedDoseAdjustment.range1.decreaseVialConcentration));
                                return newTreatmentDilVol;
                            }
                        }
                        else{
                            newTreatmentDilVol = (lastTreatmentDil + parseFloat(JSON.stringify(findProtocol.missedDoseAdjustment.range1.decreaseVialConcentration)));
                            return newTreatmentDilVol;
                        }
                    }
                    else{
                        newTreatmentDilVol = lastTreatmentDil;
                        return newTreatmentDilVol;
                    }
                }
            }
        }
            
            
        /*
            Calculation of next bottleNumber
        */
        function BottleNumberCalc(lastTreatmentBN, lastTreatmentLLR, lastTreatmentInj, lastTreatmentDil, ptMaintBottle, vialTestKey){

            let newTreatmentBotNum = 0;

            if(lastTreatmentInj < parseFloat(JSON.stringify(findProtocol.nextDoseAdjustment.maxInjectionVol))){

                if(lastTreatmentLLR >= parseFloat(JSON.stringify(findProtocol.largeReactionsDoseAdjustment.whealLevelForAdjustment))){
                    if(lastTreatmentBN == "M"){
                        if((ptMaintBottle - parseInt(JSON.stringify(findProtocol.largeReactionsDoseAdjustment.adjustBottleNumber))) < 1){
                            newTreatmentBotNum = 1;
                            return newTreatmentBotNum;
                        }
                        else{
                            newTreatmentBotNum = (ptMaintBottle - parseInt(JSON.stringify(findProtocol.largeReactionsDoseAdjustment.adjustBottleNumber)));
                            return newTreatmentBotNum;
                        }
                    }
                    else{
                        if((parseInt(lastTreatmentBN) - parseInt(JSON.stringify(findProtocol.largeReactionsDoseAdjustment.adjustBottleNumber))) < 1){
                            newTreatmentBotNum = 1;
                            return newTreatmentBotNum;
                        }
                        else{
                            newTreatmentBotNum = (parseInt(lastTreatmentBN) - parseInt(JSON.stringify(findProtocol.largeReactionsDoseAdjustment.adjustBottleNumber)));
                            return newTreatmentBotNum;
                        }
                    }
                }
                else{
    
                    if(dateDifference >= parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range4.days))){
                        if(lastTreatmentBN == "M"){
                            if((ptMaintBottle - parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range4.decreaseBottleNumber))) < 1){
                                newTreatmentBotNum = 1;
                                return newTreatmentBotNum;
                            }
                            else{
                                newTreatmentBotNum = (ptMaintBottle - parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range4.decreaseBottleNumber)));
                                return newTreatmentBotNum;
                            }
                        }
                        else{
                            if((parseInt(lastTreatmentBN) - parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range4.decreaseBottleNumber))) < 1){
                                newTreatmentBotNum = 1;
                                return newTreatmentBotNum;
                            }
                            else{
                                newTreatmentBotNum = (parseInt(lastTreatmentBN) - parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range4.decreaseBottleNumber)));
                                return newTreatmentBotNum;
                            }
                        }
                    }
                    else if(dateDifference >= parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range3.days))){
                        if(lastTreatmentBN == "M"){
                            if((ptMaintBottle - parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range3.decreaseBottleNumber))) < 1){
                                newTreatmentBotNum = 1;
                                return newTreatmentBotNum;
                            }
                            else{
                                newTreatmentBotNum = (ptMaintBottle - parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range3.decreaseBottleNumber)));
                                return newTreatmentBotNum;
                            }
                        }
                        else{
                            if((parseInt(lastTreatmentBN) - parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range3.decreaseBottleNumber))) < 1){
                                newTreatmentBotNum = 1;
                                return newTreatmentBotNum;
                            }
                            else{
                                newTreatmentBotNum = (parseInt(lastTreatmentBN) - parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range3.decreaseBottleNumber)));
                                return newTreatmentBotNum;
                            }
                        }
                    }
                    else if(dateDifference >= parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range2.days))){
                        if(lastTreatmentBN == "M"){
                            if((ptMaintBottle - parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range2.decreaseBottleNumber))) < 1){
                                newTreatmentBotNum = 1;
                                return newTreatmentBotNum;
                            }
                            else{
                                newTreatmentBotNum = (ptMaintBottle - parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range2.decreaseBottleNumber)));
                                return newTreatmentBotNum;
                            }
                        }
                        else{
                            if((parseInt(lastTreatmentBN) - parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range2.decreaseBottleNumber))) < 1){
                                newTreatmentBotNum = 1;
                                return newTreatmentBotNum;
                            }
                            else{
                                newTreatmentBotNum = (parseInt(lastTreatmentBN) - parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range2.decreaseBottleNumber)));
                                return newTreatmentBotNum;
                            }
                        }
                    }
                    else if(dateDifference >= parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range1.days))){
                        if(lastTreatmentBN == "M"){
                            if((ptMaintBottle - parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range1.decreaseBottleNumber))) < 1){
                                newTreatmentBotNum = 1;
                                return newTreatmentBotNum;
                            }
                            else{
                                newTreatmentBotNum = (ptMaintBottle - parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range1.decreaseBottleNumber)));
                                return newTreatmentBotNum;
                            }
                        }
                        else{
                            if((parseInt(lastTreatmentBN) - parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range1.decreaseBottleNumber))) < 1){
                                newTreatmentBotNum = 1;
                                return newTreatmentBotNum;
                            }
                            else{
                                newTreatmentBotNum = (parseInt(lastTreatmentBN) - parseInt(JSON.stringify(findProtocol.missedDoseAdjustment.range1.decreaseBottleNumber)));
                                return newTreatmentBotNum;
                            }
                        }
                    }
                    else{
                        newTreatmentBotNum = parseInt(lastTreatmentBN);
                        return newTreatmentBotNum;
                    }
                }
            }
            else{
    
                if(parseFloat(JSON.stringify(lastTreatment.lastVialTests.get(vialTestKey).values.whealSize)) >= parseFloat(JSON.stringify(findProtocol.vialTestReactionAdjustment.whealLevelForAdjustment))){
                    if(lastTreatmentBN == "M"){
                        if((ptMaintBottle - parseInt(JSON.stringify(findProtocol.vialTestReactionAdjustment.adjustBottleNumber))) < 1){
                            newTreatmentBotNum = 1;
                            return newTreatmentBotNum;
                        }
                        else{
                            newTreatmentBotNum = (ptMaintBottle - parseInt(JSON.stringify(findProtocol.vialTestReactionAdjustment.adjustBottleNumber)));
                            return newTreatmentBotNum;
                        }
                    }
                    else{
                        if((parseInt(lastTreatmentBN) - parseInt(JSON.stringify(findProtocol.vialTestReactionAdjustment.adjustBottleNumber))) < 1){
                            newTreatmentBotNum = 1;
                            return newTreatmentBotNum;
                        }
                        else{
                            newTreatmentBotNum = (parseInt(lastTreatmentBN)- parseInt(JSON.stringify(findProtocol.vialTestReactionAdjustment.adjustBottleNumber)));
                            return newTreatmentBotNum;
                        }
                    }
                }
                else{
                    if(lastTreatmentDil == 0){
                        if(lastTreatmentBN == "M"){
                            newTreatmentBotNum = 999;
                            return newTreatmentBotNum;
                        }
                        else{
                            if((parseInt(lastTreatmentBN) + 1) > ptMaintBottle){
                                newTreatmentBotNum = 999;
                                return newTreatmentBotNum;
                            }
                            else{
                                newTreatmentBotNum = parseInt(lastTreatment) + 1;
                                return newTreatmentBotNum;
                            }
                        }
                    }
                    else{
                        newTreatmentBotNum = parseInt(lastTreatmentBN);
                        return newTreatmentBotNum;
                    }
                }
            }
        }
    }
    catch(err){
        res.status(400).json({ message: err.message })
    }
}
