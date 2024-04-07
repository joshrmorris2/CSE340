const express = require("express")
const router = new express.Router()
const utilities = require('../utilities')
const searchController = require("../controllers/searchController")

// Route to modify classification or vehicle
router.get('/', utilities.handleErrors(searchController.buildSearchResult));

module.exports = router;