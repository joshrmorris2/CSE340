const utilities = require('.')
const { body, validationResult } = require('express-validator')
const validate = {}
const accountModel = require('../models/account-model')

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registrationRules = () => {
    return [
        // firstname: required, string
        body('account_firstname')
            .trim()
            .isLength({ min: 1 })
            .withMessage('Please provide a first name.'),

        // lastname: required, string
        body('account_lastname')
            .trim()
            .isLength({ min: 2 })
            .withMessage("Please provide a last name."),

        // email: valid email, required, not in the DB
        body('account_email')
            .trim()
            .isEmail()
            .normalizeEmail()
            .withMessage('A valid email is required.')
            .custom(async(account_email) => {
                const emailExists = await accountModel.checkExistingEmail(account_email)
                if (emailExists){
                    throw new Error('Email exists. Please log in or use a different email')
                }
            }),

        // password: strong password
        body('account_password')
            .trim()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage('Password does not meet requirements.')
    ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render('account/register', {
            errors,
            title: 'Registration',
            nav,
            account_firstname,
            account_lastname,
            account_email,
        })
        return
    }
    next()
}


/*  **********************************
 *  Login Data Validation Rules
 * ********************************* */
validate.loginRules = () => {
    return [
        // email: valid email, required, not in the DB
        body('account_email')
            .trim()
            .isEmail()
            .normalizeEmail()
            .withMessage('A valid email is required.')
            .custom(async(account_email) => {
                const emailExists = await accountModel.checkExistingEmail(account_email)
                if (!emailExists){
                    throw new Error('Email does not exist. Please register or use a different email')
                }
            }),

        // password: strong password
        body('account_password')
            .trim()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage('Incorrect password')
    ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
    const { account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render('account/login', {
            errors,
            title: 'Login',
            nav,
            account_email,
        })
        return
    }
    next()
}

// Validation rules for editing account information
validate.editAccountRules = () => {
    return [
        // firstname: required, string
        body('account_firstname')
            .trim()
            .isLength({ min: 1 })
            .withMessage('Please provide a first name.'),

        // lastname: required, string
        body('account_lastname')
            .trim()
            .isLength({ min: 2 })
            .withMessage("Please provide a last name."),

        // email: valid email, required, not in the DB
        body('account_email')
            .trim()
            .isEmail()
            .normalizeEmail()
            .withMessage('A valid email is required.')
            .custom(async (account_email, { req }) => {
                if (account_email !== req.user.account_email) {
                    const emailExists = await accountModel.checkExistingEmail(account_email);
                    if (emailExists) {
                        throw new Error('Email exists. Please use a different email.');
                    }
                }
            })
    ];
};

// Middleware to check data and return errors or continue to account information editing
validate.checkEditAccountData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body;
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render('account/edit', {
            errors,
            title: 'Edit Account Information',
            nav,
            account_firstname,
            account_lastname,
            account_email,
        });
        return;
    }
    next();
};


// Validation rules for editing password
validate.editPasswordRules = () => {
    return [
        // password: strong password
        body('account_password')
            .trim()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage('Password does not meet requirements.')
    ];
};

// Middleware to check data and return errors or continue to password editing
validate.checkEditPasswordData = async (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render('account/edit-password', {
            errors,
            title: 'Change Password',
            nav,
        });
        return;
    }
    next();
};

module.exports = validate