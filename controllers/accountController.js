const utilities = require("../utilities/")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    console.log('buildLogin')
    let nav = await utilities.getNav()
    res.render('account/login', {
        title: 'Login',
        nav,
    })
}

module.exports = { buildLogin }