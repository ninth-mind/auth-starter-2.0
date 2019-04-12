const mongoose = require('mongoose')

const mongoOptions = {
  // useMongoClient: true
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false
}
// set Promise library for mongoose
mongoose.Promise = global.Promise
const dbUri = process.env.MONGO_URL || 'mongodb://localhost:27017/test'

mongoose.connect(dbUri, mongoOptions, err => {
  if (!err) console.log('Connection to database succeeded')
  else console.log('ERROR: FAILED TO CONNECT TO DATABASE \n' + err)
})

const db = mongoose.connection

exports.db = db
