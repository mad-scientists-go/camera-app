const path = require('path')
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const compression = require('compression')
// const session = require('express-session')
// const passport = require('passport')
// const SequelizeStore = require('connect-session-sequelize')(session.Store)
// const db = require('./db')
// const sessionStore = new SequelizeStore({db})
const PORT = process.env.PORT || 8081
const app = express()
const socketio = require('socket.io')
const ngrok = require("ngrok");


module.exports = app

require('../secrets')

// passport registration
// passport.serializeUser((user, done) => done(null, user.id))
// passport.deserializeUser((id, done) =>
//   db.models.user.findById(id)
//     .then(user => done(null, user))
//     .catch(done))

const createApp = () => {
  // logging middleware
  app.use(morgan('dev'))

  // body parsing middleware
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  // compression middleware
  app.use(compression())

  // session middleware with passport
  // app.use(session({
  //   secret: process.env.SESSION_SECRET || 'my best friend is Cody',
  //   store: sessionStore,
  //   resave: false,
  //   saveUninitialized: false
  // }))
  // app.use(passport.initialize())
  // app.use(passport.session())

  // auth and api routes
  // app.use('/auth', require('./auth'))
  // app.use('/api', require('./api'))

  // static file-serving middleware
  app.use(express.static(path.join(__dirname, '..', 'public')))

  // // any remaining requests with an extension (.js, .css, etc.) send 404
  app.use((req, res, next) => {
    if (path.extname(req.path).length) {
      const err = new Error('Not found')
      err.status = 404
      next(err)
    } else {
      next()
    }
  })

  // // sends index.html
  app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public/index.html'))
  })

  // error handling endware
  app.use((err, req, res, next) => {
    console.error(err)
    console.error(err.stack)
    res.status(err.status || 500).send(err.message || 'Internal server error.')
  })
}

const startListening = () => {
//   ngrok.connect(8000, function(url) {});
//   // start listening (and create a 'server' object representing our server)
 const server = app.listen(PORT, () => console.log(`Mixing it up on port ${PORT}`))
//   // console.log('server',server)
//   // set up our socket control center
  const io = socketio(server)
  app.io = io
  io.on('connect', (socket) => {
    console.log(`A socket connection to the server has been made: ${socket.id}`)
    // console.log(socket)

    //data from raspberry pi...
    socket.on('sensorData', (data) => {
      console.log(data)
      //socket.broadcast.emit('data', data)
    })

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`)
    })
  })
  
 }

// const syncDb = () => db.sync()

// This evaluates as true when this file is run directly from the command line,
// i.e. when we say 'node server/index.js' (or 'nodemon server/index.js', or 'nodemon server', etc)
// It will evaluate false when this module is required by another module - for example,
// if we wanted to require our app in a test spec
if (require.main === module) {
  createApp()
  startListening()
} else {
  createApp()
}
