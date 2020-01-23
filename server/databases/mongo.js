const mongoose = require('mongoose')
const config = require('../config').database

// set Promise library for mongoose
mongoose.Promise = global.Promise

mongoose.connect(config.uri, config.options, err => {
  if (!err) console.log('Connection to database succeeded')
  else console.log('ERROR: FAILED TO CONNECT TO DATABASE \n' + err)
})

const db = mongoose.connection

exports.db = db
