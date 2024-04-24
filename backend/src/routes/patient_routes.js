const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patient_controller');

// POST localhost:5000/api/addPatient
router.post('/addPatient', patientController.addPatient);

// POST localhost:5000/api/addPatient
router.post('/addPatientToProvider', patientController.addPatientToProvider);

// Get patients from a practice
router.get('/getPatientsByPractice/:practiceID', patientController.getPatientsByPractice);

// GET localhost:5000/api/getPatient
router.get('/getPatient/:id', patientController.getPatient);

// GET localhost:5000/api/findPatient/:email
router.get('/findPatient/:email', patientController.findPatient);

// GET localhost:5000/api/checkEmail
router.post('/checkEmail/', patientController.checkEmail);

// DELETE localhost:5000/api/addPatient
router.delete('/deletePatient/:id', patientController.deletePatient);

// POST localhost:5000/api/id (body: "eventName": "...")
router.post('/addTokens/:id', patientController.addTokens);

// GET localhost:5000/api/resetTokens
router.get('/resetTokens', patientController.resetTokens);

// Get localhost:5000/api/findPercentMaintenance/:patientID
router.get('/findPercentMaintenance/:patientID', patientController.findPercentMaintenance);

// PUT localhost:5000/api/addAllergyMedication
router.post('/updateAllergyMedication/:patientID', patientController.updateAllergyMedication);

// PUT localhost:5000/api/:email/updateMaintenanceBottleNums
router.put('/updateMaintenanceBottleNums/:patientID', patientController.updateMaintenanceBottleNums);

// GET localhost:5000/api/getAllergyMedication
router.get('/getAllergyMedication/:patientID', patientController.getAllergyMedication);

module.exports = router;

