const express = require("express")
const router = new express.Router()
const utilities = require('../utilities')
const invController = require("../controllers/invController")
const invValidate = require('../utilities/inv-validation')

// Route to add new classification or vehicle
router.get('/', utilities.handleErrors(invController.buildInvManagement));
router.get('/classification', utilities.handleErrors(invController.buildInvAddClassification));
router.get('/vehicle', utilities.handleErrors(invController.buildInvAddVehicle));

// Post routes to add new classification or vehicle
router.post(
    '/classification',
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.newClassification));
router.post(
    '/vehicle',
    invValidate.vehicleRules(),
    invValidate.checkVehicleData,
    utilities.handleErrors(invController.newVehicle));



// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:invId", utilities.handleErrors(invController.buildById));

module.exports = router;