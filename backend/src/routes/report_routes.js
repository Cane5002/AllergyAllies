const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report_controller');
//const verifyJWT = require('../middleware/verify_JWT');

//router.use(verifyJWT)
router.get('/getAllReportNames/:providerID', reportController.getAllReportNames);
// :id -> report id
router.get('/getReportData/:id', reportController.getReportData);

router.delete('/deleteReport/:id', reportController.deleteReport);

router.delete('/deleteAllReports', reportController.deleteAllReports);

router.get('/approachingMaintenanceReport/:providerID', reportController.generateApproachingMaintenanceReport);

router.get('/attritionReport/:providerID', reportController.generateAttritionReport);

router.get('/refillsReport/:providerID', reportController.generateRefillsReport);

router.get('/needsRetestReport/:providerID', reportController.generateNeedsRetestReport);

router.patch('/needsRetestSnooze', reportController.needsRetestSnooze);

router.patch('/patientRetested', reportController.patientRetested);

module.exports = router;
