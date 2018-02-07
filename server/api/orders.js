const router = require('express').Router()
const {User, Order, LineItem, Product} = require('../db/models')



//all orders
router.get('/', (req, res, next) => {
  Order.findAll({
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

//create order
router.post('/', (req, res, next) => {
  Order.create(req.body)
    .then(order => res.json(order))
    .catch(next)
})


//search for orders by search fields
router.get('/search', (req, res, next) => { //used to be post '/' changed to support create order.
  Order.findAll({
    where: req.body,
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

//completed orderss
router.get('/completed', (req, res, next) => {
  Order.findAll({
    where: {
				status: 'paid'
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
router.get('/:userId', (req, res, next) => {
  Order.findAll({
		where: {
			userId: req.params.userId
		},
		include: [
			{
				model: LineItem,
				include: [Product]
			}
		]
	})
    .then(Orders => res.json(Orders))
    .catch(next)
})

//unpaid or pending orders
router.get('/unpaid', (req, res, next) => {
  Order.findAll({
    where: {
				status: 'pending'
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
router.put('/:id', (req, res, next) => {
	console.log(req.params, req.body, 'info')
	Order.update({status: req.body.status}, {
		where: {
			id: req.params.id
		}
	}).then(Order.findOne({ where: {id: Number(req.params.id)}, include: [
			User,
			{
				model: LineItem,
				include: [Product]
			}
	]}).then(data => {
		console.log(data)
		res.json(data)
	
	}))
	.catch(next)
})

router.get('/cart/:userId', (req, res, next) => {
	Order.findOne({
		where: {
			userId: req.params.userId,
			status: 'cart'
		},
		include: [
			{
				model:LineItem,
				include: [Product]
			}
		]
	})
	.then(order => res.json(order))
})

module.exports = router
