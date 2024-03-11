const invModel = require('../models/inventory-model')
const utilities = require('../utilities')

/* ***************************
 *  Build inventory modification view
 * ************************** */
async function buildInvManagement(req, res, next) {
    try {
        let nav = await utilities.getNav()
        res.render('./inventory/management', {
            title: 'Vehicle Management',
            nav,
            errors: null,
        })
    } catch (error) {
        next(error);
    }
}

/* ***************************
 *  Build Add New Classification View
 * ************************** */
async function buildInvAddClassification(req, res, next) {
    try {
        let nav = await utilities.getNav()
        res.render('./inventory/add-classification', {
            title: 'Add New Classification',
            nav,
            errors: null,
        })
    } catch (error) {
        next(error);
    }
}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
async function buildByClassificationId(req, res, next) {
    try {
        const classification_id = req.params.classificationId
        const data = await invModel.getInventoryByClassificationId(classification_id)
        const grid = await utilities.buildClassificationGrid(data)
        let nav = await utilities.getNav()
        const className = data[0].classification_name
        res.render('./inventory/classification', {
            title: className + ' vehicles',
            nav,
            grid,
        })
    } catch (error) {
        next(error);
    }
}

/* ***************************
 *  Build inventory by single item view
 * ************************** */
async function buildById(req, res, next) {
    try {
        const inv_id = req.params.invId
        const data = await invModel.getInventoryById(inv_id)
        const grid = await utilities.buildItemGrid(data)
        let nav = await utilities.getNav()
        if (data.classification_id == 1) {
            className = data[0].inv_year + ' ' + data[0].inv_model + ' ' + data[0].inv_make
        } else{
            className = data[0].inv_year + ' ' + data[0].inv_make + ' ' + data[0].inv_model
        }
        res.render('./inventory/item', {
            title: className,
            nav,
            grid,
        })
    } catch (error) {
        next(error);
    }
}

/* ****************************************
*  Process Add Classification
* *************************************** */
async function newClassification(req, res) {
    const { classification_name } = req.body

    const classificationResult = await invModel.addClassification(
        classification_name
    )
    
    let nav = await utilities.getNav()
  
    if (classificationResult) {
        req.flash(
        "notice",
        `Congratulations, you\'ve added the ${classification_name} classification.`
        )
        res.render('./inventory/management', {
            title: 'Vehicle Management',
            nav,
            errors: null,
        })
    } else {
        req.flash("notice", "Sorry, creating the new classification failed.")
        res.status(501).render("./inventory/add-classification", {
            title: "Add New Classification",
            nav,
            errors: null,
      })
    }
  }

module.exports = { buildInvManagement, buildInvAddClassification, buildByClassificationId, buildById, newClassification}