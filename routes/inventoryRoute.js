const express = require("express")
const router = new express.Router()
const utilities = require('../utilities')
const invController = require("../controllers/invController")
const invValidate = require('../utilities/inv-validation')

// Route to modify classification or vehicle
router.get('/', utilities.adminAccess, utilities.handleErrors(invController.buildInvManagement));
router.get('/classification', utilities.adminAccess, utilities.handleErrors(invController.buildInvAddClassification));
router.get('/vehicle', utilities.adminAccess, utilities.handleErrors(invController.buildInvAddVehicle));
router.get('/getInventory/:classification_id', utilities.adminAccess, utilities.handleErrors(invController.getInventoryJSON));
router.get('/edit/:invId', utilities.adminAccess, utilities.handleErrors(invController.buildEditInventory));

// Post routes to add new classification or vehicle
router.post(
    '/classification',
    utilities.adminAccess,
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.newClassification));
router.post(
    '/vehicle',
    utilities.adminAccess,
    invValidate.vehicleRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.newVehicle));
router.post(
    '/update/',
    utilities.adminAccess,
    invValidate.vehicleUpdateRules(),
    invValidate.checkVehicleData,
    utilities.handleErrors(invController.updateVehicle));

// Delete inventory route
router.get('/delete/:invId', utilities.adminAccess, utilities.handleErrors(invController.buildDeleteConfirmation));
router.post('/delete/', utilities.adminAccess, utilities.handleErrors(invController.deleteVehicle));


// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:invId", utilities.handleErrors(invController.buildById));

module.exports = router;