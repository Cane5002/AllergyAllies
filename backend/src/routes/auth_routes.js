const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth_controller')

router.route('/provider')
    .post(authController.providerLogin)

router.route('/patient')
    .post(authController.patientLogin)

router.route('/refresh')
    .get(authController.refresh)

router.route('/logout')
    .post(authController.logout)

module.exports = router;