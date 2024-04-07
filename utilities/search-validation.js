const utilities = require('.')
const { body, validationResult, query } = require('express-validator')
const validate = {}

// Validation rules for search term
validate.searchTermRules = () => {
    return [
        // Search term: required, should be one word
        query('search_term')
            .trim()
            .notEmpty()
            .withMessage('Search term is required.')
            .custom(value => {
                // Validate that the search is one word
                if (/\s/.test(value)) {
                    throw new Error('Search term should be one word.');
                }
                return true;
            })
    ];
};

// Middleware to check data and return errors or continue to search
validate.checkSearchData = async (req, res, next) => {
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        req.flash("notice", 'search failed');
        res.redirect('/')
        return;
    }
    next();
};

module.exports = validate