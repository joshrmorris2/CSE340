const utilities = require('.')
const { body, validationResult } = require('express-validator')
const validate = {}

validate.classificationRules = () => {
    return [
        // classification: required, string
        body('classification_name')
            .trim()
            .isLength({ min: 1 })
            .isAlpha()
            .withMessage('Please provide a valid classification.')
    ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    console.log(errors)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render('./inventory/add-classification', {
            errors,
            title: 'Add New Classification',
            nav,
            classification_name
        })
        return
    }
    next()
}




module.exports = validate