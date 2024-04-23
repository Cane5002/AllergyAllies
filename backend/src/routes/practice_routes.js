const express = require('express');
const router = express.Router();
const practiceController = require('../controllers/practice_controller');

//router.use(verifyJWT)

// Add a practice
router.post('/addPractice', practiceController.addPractice);

// Update practice by ID
router.put('/updatePractice/:id', practiceController.updatePractice);

// Get a practice by ID
router.get('/practice/:id', practiceController.getPractice);

// Delete a practice by ID
router.delete('/deletePractice/:id', practiceController.deletePractice);

// get location given id
router.get('/location/:id', practiceController.getLocation);

// get logo given id
router.get('/logo/:id', practiceController.getLogo);

// get scrollingAds given id
router.get('/ads/:id', practiceController.getScrollingAds);

// get antigens tested given id
router.get('/antigens/:id', practiceController.getAntigensTested);

// save uploaded images
router.post('/uploadLogo/:id', practiceController.uploadLogo);

module.exports = router;

