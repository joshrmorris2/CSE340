const express = require("express")
const router = new express.Router()
const utilities = require('../utilities')
const searchController = require("../controllers/searchController")
const searchValidate = require('../utilities/search-validation')

// Route to modify classification or vehicle
router.get(
    '/',
    searchValidate.searchTermRules(),
    searchValidate.checkSearchData,
    utilities.handleErrors(searchController.buildSearchResult));

module.exports = router;