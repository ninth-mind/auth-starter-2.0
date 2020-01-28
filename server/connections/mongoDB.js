const mongoose = require('mongoose')
const config = require('../config').database.mongo

// set Promise library for mongoose
mongoose.Promise = global.Promise

async function connect() {
  try {
    await mongoose.connect(config.uri, config.options)
    console.log('Connected to MONGO database')
  } catch (err) {
    console.log('ERROR CONNECTING TO MONGO DATABASE', err)
  }
}

connect()

module.exports = {
  connection: mongoose.connection
}
