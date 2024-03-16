const utilities = require('.')
const { body, validationResult } = require('express-validator')
const validate = {}

/* ******************************
 * Define Validation for classification
 * ***************************** */
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
 * Check data and return errors or continue
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

/* ******************************
 * Define validation for new vehicle
 * ***************************** */
validate.vehicleRules = () => {
    return [
        // classification_id: required, integer
        body('classification_id')
            .trim()
            .isInt({ min: 1 })
            .withMessage('Please select a valid classification.'),

        // inv_make: required, alphanumeric with spaces, underscores, and hyphens
        body('inv_make')
            .trim()
            .isLength({ min: 1 })
            .matches(/[a-zA-Z0-9\s_-]+/)
            .withMessage('Please enter a valid make.'),

        // inv_model: required, alphanumeric with spaces, underscores, and hyphens
        body('inv_model')
            .trim()
            .isLength({ min: 1 })
            .matches(/[a-zA-Z0-9\s_-]+/)
            .withMessage('Please enter a valid model.'),

        // inv_description: required
        body('inv_description')
            .trim()
            .isLength({ min: 1 })
            .withMessage('Please enter a valid description.'),

        // inv_image: required, alphanumeric with dots and valid image file extensions
        body('inv_image')
            .trim()
            .isLength({ min: 1 })
            .matches(/[a-zA-Z0-9_-]+(\.[a-zA-Z]{1,4})?/)
            .withMessage('Please enter a valid image path.'),

        // inv_thumbnail: required, alphanumeric with dots and valid image file extensions
        body('inv_thumbnail')
            .trim()
            .isLength({ min: 1 })
            .matches(/[a-zA-Z0-9_-]+(\.[a-zA-Z]{1,4})?/)
            .withMessage('Please enter a valid thumbnail path.'),

        // inv_price: required, numeric
        body('inv_price')
            .trim()
            .isNumeric()
            .withMessage('Please enter a valid price.'),

        // inv_year: required, four-digit numeric
        body('inv_year')
            .trim()
            .isNumeric()
            .isLength({ min: 4, max: 4 })
            .withMessage('Please enter a valid year (four digits).'),

        // inv_miles: required, non-negative integer
        body('inv_miles')
            .trim()
            .isInt({ min: 0 })
            .withMessage('Please enter a valid miles value.'),

        // inv_color: required, alphanumeric with spaces
        body('inv_color')
            .trim()
            .isLength({ min: 1 })
            .matches(/[a-zA-Z\s]+/)
            .withMessage('Please enter a valid color.'),
    ];
};

/* ******************************
 * Check data and return errors or continue
 * ***************************** */
validate.checkVehicleData = async (req, res, next) => {
    const {
        classification_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
    } = req.body;

    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        let dropdown = await utilities.getDropdown();

        res.render('./inventory/add-vehicle', {
            errors,
            title: 'Add New Vehicle',
            nav,
            dropdown,
            classification_id,
            inv_make,
            inv_model,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_year,
            inv_miles,
            inv_color,
        });
        return;
    }

    next();
};

module.exports = validate