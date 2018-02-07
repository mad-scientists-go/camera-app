const Sequelize = require('sequelize')
require('../../secrets')
console.log(process.env.DATABASE_URL)
const db = new Sequelize(
  process.env.DATABASE_URL,
  {
    logging: false
  }
)
module.exports = db
