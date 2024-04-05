const utilities = require("../utilities/")
const accountModel = require('../models/account-model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render('account/login', {
        title: 'Login',
        nav,
        errors: null,
    })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req,res,next) {
    let nav = await utilities.getNav()
    res.render('account/register', {
        title: 'Registration',
        nav,
        errors: null,
    })
}

/* ****************************************
*  Deliver account view
* *************************************** */
async function buildAccount(req,res,next) {
    let nav = await utilities.getNav()
    user = res.locals.accountData
    res.render('account/account', {
        title: 'Welcome ' + user.account_firstname,
        nav,
        errors: null,
    })
}

/* ***************************
 *  Build edit account view
 * ************************** */
async function buildEditAccount(req, res) {
    try {
        let nav = await utilities.getNav();
        res.render("./account/edit-account", {
            title: 'Edit Account',
            nav,
            errors: null,
        });
    } catch (error) {
        req.flash("notice", "Sorry, something went wrong.");
        res.redirect('/account/')
    }
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    // Hash password
    let hashedPassword
    try {
        //regular password and cost
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash('notice', 'Sorry, there was an error processing the registration')
        res.status(500).render('account/register', {
            title: 'Register',
            nav,
            errors: null,
        })
    }

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )
  
    if (regResult) {
        req.flash(
        "notice",
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
        )
        res.status(201).render("account/login", {
            title: "Login",
            nav,
            errors: null,
      })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
      })
    }
  }

/* ****************************************
*  Process Edit Account information
* *************************************** */
const updateAccount = async (req, res) => {
    // Extract account data from request body
    const { account_firstname, account_lastname, account_email, account_id } = req.body;

    // Update account information in the database
    try {
        await accountModel.updateAccount(account_id, { account_firstname, account_lastname, account_email });
        // Generate a new JWT with updated account information
        const updatedAccount = {
            account_id,
            account_firstname,
            account_lastname,
            account_email,
        };
        const accessToken = jwt.sign(updatedAccount, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 });
        if(process.env.NODE_ENV === 'development') {
            res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
        } else {
            res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
        }
        req.flash('success_msg', 'Account information updated successfully.');
        res.redirect('/account'); // Redirect to account dashboard or profile page
    } catch (error) {
        console.error('Error updating account:', error);
        req.flash('error_msg', 'An error occurred while updating account information.');
        res.redirect('/account'); // Redirect to account dashboard or profile page with error message
    }
};

/* ****************************************
*  Process Edit Account Password
* *************************************** */
const updatePassword = async (req, res) => {
    // Extract new password from request body
    const { account_password, account_id } = req.body;

    // Hash the new password before updating
    const hashedPassword = await bcrypt.hash(account_password, 10);

    // Update password in the database
    try {
        await accountModel.updatePassword(account_id, hashedPassword);
        req.flash('success_msg', 'Password updated successfully.');
        res.redirect('/account'); // Redirect to account dashboard or profile page
    } catch (error) {
        console.error('Error updating password:', error);
        req.flash('error_msg', 'An error occurred while updating password.');
        res.redirect('/account'); // Redirect to account dashboard or profile page with error message
    }
};


/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)
    if (!accountData) {
        req.flash("notice", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email,
            })
        return
    }
    try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            delete accountData.account_password
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
            if(process.env.NODE_ENV === 'development') {
                res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
            } else {
                res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
            }
            return res.redirect("/account/")
        }
    } catch (error) {
        return new Error('Access Forbidden')
    }
}

/* ****************************************
 *  Process logout request
 * ************************************ */
async function accountLogout(req, res) {
    res.clearCookie("jwt")
    res.redirect('/')
}

module.exports = { 
    buildLogin, 
    buildRegister, 
    buildAccount, 
    buildEditAccount, 
    registerAccount,
    updateAccount,
    updatePassword,
    accountLogin, 
    accountLogout }