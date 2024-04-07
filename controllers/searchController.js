const utilities = require("../utilities/")
const searchModel = require('../models/search-model')

/* ***************************
 *  Build inventory modification view
 * ************************** */
async function buildSearchResult(req, res, next) {
    const searchTerm = req.query.search_term
    try {
        let data = await searchModel.getSearchResults(searchTerm)
        console.log(data)
        const grid = await utilities.buildClassificationGrid(data)
        let nav = await utilities.getNav()
        res.render('./inventory/search-result', {
            title: 'Search Results',
            nav,
            grid,
            searchTerm,
            errors: null,
        })
    } catch (error) {
        next(error);
    }
}

module.exports = { 
    buildSearchResult
}