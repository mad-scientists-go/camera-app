const crypto = require('crypto')
const Sequelize = require('sequelize')
const db = require('../db')

const Product = db.define('product', {
  	name: {
		type: Sequelize.STRING
	},
	price: {
		type: Sequelize.INTEGER
	},
	inventory: {
		type: Sequelize.INTEGER
	},
	barcode: {
		type: Sequelize.STRING
	}

})

module.exports = Product

/**
 * instanceMethods
 */
