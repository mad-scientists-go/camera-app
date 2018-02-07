const router = require('express').Router()
const {LineItem, Product, Order} = require('../db/models')
const socket = require('../socket')
module.exports = router

router.post('/', (req, res, next) => { // order id , product id , price and quantity.
  const { orderId, productId,  quantity } = req.body
  console.log(orderId, productId, quantity, 'our original items to post')
  LineItem
  .findOrCreate({
    where: {
      orderId,
      productId
    }, defaults: {
      orderId,
      productId,
      qty: quantity
    }
  })
  .then(([lineItem, created]) => {
    console.log(created, 'did it create or go ape?')
    if (!created){
      console.log('findOrCreate', req.body)
      return lineItem.update({ qty: req.body.quantity + lineItem.qty })
      .then(() => {
        //if it was updated
        Product.increment('inventory', { by: -req.body.quantity, where: { id: lineItem.productId } })
      })
      //lineItem.quantity = lineItem.quantity + req.body.quantity // updating the quantity
      // lineItem.save()
    }
  })
  .then(() => {
    Order.findById(orderId).then(order => {
      req.app.io.emit('mobile-cart-update', { data: order })
      res.json(order)
    })
  })
  .catch(next)
})


router.delete('/', (req, res, next) => {
  LineItem.destroy({
		where: {
			id: req.body.id
		}
	})
    .then(item => res.json(item))
    .catch(next)
})
