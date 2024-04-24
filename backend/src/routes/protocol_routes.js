const express = require('express');
const router = express.Router();
const protocolController = require('../controllers/protocol_controller');

//add protocol
router.post('/addProtocol', protocolController.addProtocol);
//get protocol
router.get('/getProtocol/:practiceID', protocolController.getProtocol);
//patch protocol
router.put('/updateProtocol/:practiceID', protocolController.updateProtocol);

module.exports = router;