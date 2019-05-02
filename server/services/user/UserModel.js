const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const bcrypt = require('bcryptjs')
const SALT_WORK_FACTOR = 10

const UserSchema = mongoose.Schema(
  {
    source: String,
    email: {
      type: String,
      index: { unique: true },
      uniqueCaseInsensitive: true,
      trim: true
    },
    username: {
      type: String,
      index: { unique: true },
      uniqueCaseInsensitive: true,
      trim: true
    },
    value: {
      type: Number,
      default: 1
    },
    region: String,
    permissions: [String],
    password: String,
    confirmed: {
      type: Boolean,
      default: false
    },
    instagram: {
      id: { type: String, index: true },
      token: String,
      username: String,
      displayName: String
    },
    facebook: {
      id: { type: String, index: true },
      token: String,
      email: String,
      name: String
    }
  },
  { timestamps: true }
)

UserSchema.pre('save', function(next) {
  var user = this
  this.wasNew = this.isNew

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

UserSchema.methods.comparePassword = function(candidatePassword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
      if (err) return reject(err)
      return resolve(isMatch)
    })
  })
}

UserSchema.plugin(uniqueValidator, { type: 'unique-validator' })

module.exports = mongoose.model('User', UserSchema)
