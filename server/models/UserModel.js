const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const SALT_WORK_FACTOR = 10

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    index: { unique: true },
    trim: true
  },
  randomNum: {
    type: String,
    default: `${Math.random()}`
  },
  password: String,
  fname: {
    type: String,
    lowercase: true,
    trim: true
  },
  lname: {
    type: String,
    lowercase: true,
    trim: true
  },
  signedUpDate: {
    type: Date,
    default: Date.now()
  }
})

UserSchema.pre('save', function(next) {
  var user = this

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next()

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return next(err)

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err)

      // override the cleartext password with the hashed one
      user.password = hash
      next()
    })
  })
})

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err)
    cb(null, isMatch)
  })
}

module.exports = mongoose.model('User', UserSchema)
