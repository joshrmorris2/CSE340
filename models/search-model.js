const pool = require("../database/")

/* ***************************
 *  Get inventory items by search term
 * ************************** */
async function getSearchResults(searchTerm) {
    const sql = `
    SELECT *
    FROM public.inventory
    WHERE
        inv_make ILIKE $1 OR
        inv_model ILIKE $1 OR
        inv_year ILIKE $1 OR
        inv_description ILIKE $1 OR
        CAST(inv_price AS TEXT) ILIKE $1 OR
        CAST(inv_miles AS TEXT) ILIKE $1 OR
        inv_color ILIKE $1
        `


    const values = [`%${searchTerm}%`]

    try {
      const data = await pool.query(sql,values)
      return data.rows
    } catch (error) {
      console.error('Search Model error: ' + error)
    }
  }

  module.exports = {
    getSearchResults
  }