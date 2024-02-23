const invModel = require('../models/inventory-model')
const utilities = require('../utilities')

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
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
invCont.buildById = async function (req, res, next) {
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

module.exports = invCont