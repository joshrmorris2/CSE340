const invModel = require('../models/inventory-model')
const utilities = require('../utilities')

/* ***************************
 *  Build inventory modification view
 * ************************** */
async function buildInvManagement(req, res, next) {
    try {
        let nav = await utilities.getNav()
        const dropdown = await utilities.getDropdown()

        res.render('./inventory/management', {
            title: 'Vehicle Management',
            nav,
            dropdown,
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
 *  Build Add New Vehicle View
 * ************************** */
async function buildInvAddVehicle(req, res, next) {
    try {
        let nav = await utilities.getNav()
        let dropdown = await utilities.getDropdown()
        res.render('./inventory/add-inventory', {
            title: 'Add New Vehicle',
            nav,
            dropdown,
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
            className = data.inv_year + ' ' + data.inv_model + ' ' + data.inv_make
        } else{
            className = data.inv_year + ' ' + data.inv_make + ' ' + data.inv_model
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

/* ***************************
 *  Build edit inventory view
 * ************************** */
async function buildEditInventory(req, res) {
    try {
        const inv_id = parseInt(req.params.invId);
        let nav = await utilities.getNav();
        let data = await invModel.getInventoryById(inv_id);
        let dropdown = await utilities.getDropdown();
        let itemName = `${data.inv_make} ${data.inv_model}`
    
        res.render("./inventory/edit-inventory", {
            title: `Edit ${itemName}`,
            nav,
            dropdown,
            errors: null,
            // Pass other data needed for rendering the form
            classification_id: data.classification_id,
            inv_make: data.inv_make,
            inv_model: data.inv_model,
            inv_description: data.inv_description,
            inv_image: data.inv_image,
            inv_thumbnail: data.inv_thumbnail,
            inv_price: data.inv_price,
            inv_year: data.inv_year,
            inv_miles: data.inv_miles,
            inv_color: data.inv_color,
            inv_id: data.inv_id,
        });
    } catch (error) {
        req.flash("notice", "Sorry, something went wrong.");
        res.render('./inventory/management', {
            title: 'Vehicle Management',
            nav,
            errors: null,
        });
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

/* ****************************************
 * Process Add Vehicle
 * *************************************** */
async function newVehicle(req, res) {
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

    const vehicleResult = await invModel.addVehicle({
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

    let nav = await utilities.getNav();
    let dropdown = await utilities.getDropdown();

    if (vehicleResult) {
        req.flash(
            "notice",
            `Congratulations, you've added a new vehicle.`
        );
        res.render('./inventory/management', {
            title: 'Vehicle Management',
            nav,
            errors: null,
        });
    } else {
        req.flash("notice", "Sorry, creating the new vehicle failed.");
        res.status(501).render("./inventory/add-vehicle", {
            title: "Add New Vehicle",
            nav,
            dropdown,
            errors: null,
            // Pass other data needed for rendering the form
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
    }
}

updateVehicle
/* ****************************************
 * Process Update Vehicle
 * *************************************** */
async function updateVehicle(req, res) {
    let nav = await utilities.getNav();

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
        inv_id,
    } = req.body;

    const updateResult = await invModel.updateVehicle({
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
        inv_id,
    });

    if (updateResult) {
        const itemName = updateResult.inv_make + " " + updateResult.inv_model
        req.flash("notice", `The ${itemName} was successfully updated.`);
        res.redirect('/inv/')
    } else {
        let dropdown = await utilities.getDropdown();
        const itemName = `${inv_make} ${inv_model}`
        req.flash("notice", "Sorry, updating the vehicle failed.");
        res.status(501).render("./inventory/add-vehicle", {
            title: "Edit " + itemName,
            nav,
            dropdown,
            errors: null,
            // Pass other data needed for rendering the form
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
            inv_id,
        });
    }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
async function getInventoryJSON(req, res, next) {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id) {
      return res.json(invData)
    } else {
      next(new Error("No data returned"))
    }
}

module.exports = { 
    buildInvManagement,
    buildInvAddClassification,
    buildInvAddVehicle,
    buildByClassificationId,
    buildById,
    buildEditInventory,
    newClassification,
    newVehicle,
    updateVehicle,
    getInventoryJSON
}