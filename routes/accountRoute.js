const express = require("express")
const router = new express.Router()
const utilities = require('../utilities')
const accountController = require("../controllers/accountController")
const validate = require('../utilities/account-validation')

router.get('/', utilities.checkLogin, utilities.handleErrors(accountController.buildAccount));
router.get('/login', utilities.handleErrors(accountController.buildLogin));
router.get('/register', utilities.handleErrors(accountController.buildRegister));
router.get('/logout', utilities.checkLogin, utilities.handleErrors(accountController.accountLogout))
router.get('/update', utilities.checkLogin, utilities.handleErrors(accountController.buildEditAccount))
router.post(
    '/register',
    validate.registrationRules(),
    validate.checkRegData,
    utilities.handleErrors(accountController.registerAccount));

//Process the login attempt
router.post('/login', 
    validate.loginRules(),
    validate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
)

router.post('/update/account', 
    validate.editAccountRules(),
    validate.checkEditAccountData,
    utilities.checkLogin, 
    utilities.handleErrors(accountController.updateAccount))
router.post('/update/password', 
    validate.editPasswordRules(),
    validate.checkEditPasswordData,
    utilities.checkLogin, 
    utilities.handleErrors(accountController.updatePassword))

module.exports = router;