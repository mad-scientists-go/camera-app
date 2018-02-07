const router = require('express').Router()
const {User, Order, LineItem, Product} = require('../db/models')

module.exports = router

router.get('/', (req, res, next) => {
  User.findAll({
    // explicitly select only the id and email fields - even though
    // users' passwords are encrypted, it won't help if we just
    // send everything to anyone who asks!
    attributes: ['id', 'email']
  })
    .then(users => res.json(users))
    .catch(next)
})
router.get('/inStoreUser', (req, res, next) => {
  let subject_id = req.body.subject_id
  User.findOne({
    where: {
      subject_id
    }
    ,
    include: [
      Order.findOne({
        where: {
          status: 'cart'
        }
      })
    ]
  })
  .then(user => res.json(user))
  .catch(next)
})
//search for users by search fields
router.post('/', (req, res, next) => {
  User.findAll({
    where: req.body
  })
    .then(users => res.json(users))
    .catch(next)
})

//instore users
router.get('/instore', (req, res, next) => {
  Order.findAll({
    where: {
			status: 'cart'
		},
		include: [
			User,
			{
				model: LineItem,
				include: [Product]
			}
		]
  })
    .then(users => res.json(users))
    .catch(next)
})
