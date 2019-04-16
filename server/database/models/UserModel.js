const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const SALT_WORK_FACTOR = 10

const UserSchema = mongoose.Schema(
  {
    source: String,
    email: {
      type: String,
      index: true,
      trim: true
    },
    displayName: {
      type: String,
      trim: true
    },
    name: {
      type: String,
      lowercase: true,
      trim: true
    },
    value: {
      type: Number,
      default: 1
    },
    password: String,
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
  console.log('passwords', candidatePassword, this.password)
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err)
    cb(null, isMatch)
  })
}

module.exports = mongoose.model('User', UserSchema)
