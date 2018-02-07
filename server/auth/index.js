const router = require('express').Router()
const nodemailer = require('nodemailer')
const User = require('../db/models/user')
const Order = require('../db/models/order')
const LineItem = require('../db/models/lineItem')
const Product = require('../db/models/product')
if (process.env.NODE_ENV !== 'production') require('../../secrets');
const stripe = require('stripe')(process.env.STRIPE_KEY);
module.exports = router

router.post('/signup-image', (req, res, next) => {
  console.log('made it to sign-up', req.body)
  User.create(req.body)
    .then(user => {
      console.log('USER', user)
      req.login(user, err => (err ? next(err) : res.json(user)))
    })
    .catch(err => {
      if (err.name === 'SequelizeUniqueConstraintError') {
        res.status(401).send('User already exists')
      } else {
        next(err => console.log('this is it', err))
      }
    })
})

router.post('/face-auth/walk-in', (req, res, next) => { //return object with user and {user id, status=cart}
	let foundUser = null
  User.findOne({
    where: {
      subject_id: req.body.subject_id
    }
  })
  .then(userData => {
		if (userData.dataValues) {
			foundUser = userData.dataValues
			return Order.create({ userId: foundUser.id })
		} else {
			console.log('error return something..')
			//res.json()
		}
	})
	.then(orderData => res.json({ user: foundUser, order: orderData.dataValues }))
  .catch(err => console.log(err))
})

router.post('/face-auth/walk-out', (req, res, next) => {
  User.findOne({
    where: {
      subject_id: req.body.subject_id
    }
  })
  .then(data => {
    return Order.findOne({
      where: {
        status: 'cart',
        userId: data.dataValues.id
      },
      include:[
        User,
        {
          model: LineItem,
          as: 'lineItems'
        },
      ]
    })
    .then(order => {
      stripe.customers.create({
        email: order.user.email
      }).then(function(customer){
        return stripe.customers.createSource(customer.id, {
          source: order.user.cardNum
        });
      }).then(function(source) {
        return stripe.charges.create({
          amount: order.subtotal * 100,
          currency: 'usd',
          customer: source.customer
        });
      }).then(function(charge) {
          console.log('charge created', charge)
         return order.update({ status: 'pending' })
      }).catch(function(err) {
        console.log(err)
      })

      console.log(order)
    })
    .then((order) => {
      
      sendEmail(order)
    })
	})
  .catch(err => console.log(err))
})


//mobile app routes....
router.post('/logout', (req, res) => {
  req.logout()
  req.session.destroy()
  res.redirect('/')
})

router.get('/me', (req, res) => {
  res.json(req.user || null)
})

router.post('/signup', (req, res, next) => {
  User.create(req.body)
    .then(user => {
      req.login(user, err => (err ? next(err) : res.json(user)))
    })
    .catch(err => {
      if (err.name === 'SequelizeUniqueConstraintError') {
        res.status(401).send('User already exists')
      } else {
        next(err)
      }
    })
})

router.post('/adminLogin', (req, res, next) => {
  console.log(req.body, 'login admin')
  User.findOne({where: {email: req.body.email}})
    .then(user => {
      if (!user) {
        res.status(401).send('User not found')
      } else if(user.isAdmin) {
        req.login(user, err => (err ? next(err) : res.json(user)))
      } else {
        res.sendStatus(401)
      }
    })
    .catch(next)
})
router.post('/login-mobile', (req, res, next) => {
  User.findOne({where: {email: req.body.email}})
    .then(user => {
      if (!user) {
        res.status(401).send('User not found')
      } else {
        req.login(user, err => (err ? next(err) : res.json(user)))
      }
    })
    .catch(next)
})

router.post('/login-mobile', (req, res, next) => {
  User.findOne({where: {email: req.body.email}})
    .then(user => {
      if (!user) {
        res.status(401).send('User not found')
      } else {
        res.json(user)
      }
    })
    .catch(next)
})

const sendEmail = (order) => {

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'xunszjuwmvn7wcng@ethereal.email', // generated ethereal user
            pass: 'srg5DbKXvqU86QJxHu'  // generated ethereal password
        }
    })
    let tblRows = order.lineItems.reduce((item, finalStr) => {
      // return item.getParent()
      return finalStr + `<tr><td>${item.id}</td><td>${item.qty}</td><td>${item.purchasePrice}</td></tr>`
    }, '')

    let tbl = '<table><th>product</th><th>qty</th><th>price</th>' + tblRows + '</table>'
    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Fred Foo 👻" <test@aol.com>', // sender address
        to: order.user.email, // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world?', // plain text body
        html: tbl // html body
    }

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    })
}

router.use('/google', require('./google'))
