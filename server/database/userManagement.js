const User = require('./models/UserModel')
const { handleError } = require('../lib/utils')

/**
 * Finds or creates user.
 * @param {string} source - source of profile
 * @param {object} profile - user profile object to create *MUST HAVE SOURCE*
 * @param {object} res - express response object
 */
function findOrCreateUser(source, profile, res) {
  return new Promise((resolve, reject) => {
    findUser(source, { ...profile, source }, res)
      .then(user => {
        if (user) resolve(user)
        else {
          let newProf = loginMapper(source, profile)
          User.create(newProf)
            .then(user => {
              resolve(user)
            })
            .catch(err => reject(err))
        }
      })
      .catch(err => {
        handleError(err, res, 1003)
        reject(err)
      })
  })
}

/**
 * Returns a user or null if not user is found
 * @param {string} source - source of login
 * @param {object} profile - profile
 * @param {object} res - express response object
 */
function findUser(source, profile, res) {
  return new Promise((resolve, reject) => {
    let query = determineQueryFromSource(source, profile)
    User.find(query)
      .then(users => {
        if (!users) resolve()
        // putting this here just in CASE
        else if (users.length > 1) handleError(null, res, 1001)
        else resolve(users[0] || null)
      })
      .catch(err => {
        handleError(err, res, 1002)
        reject(err)
      })
  })
}

/**
 *
 * @param {string} source - source of user account
 * @param {object} profile - profile data to search for
 * @param {object} update - object to update user with
 * @param {object} opts - options object to pass query
 * @param {object} res - express response object
 */
function findOneAndUpdate(source, profile, update, opts, res) {
  return new Promise((resolve, reject) => {
    let query = determineQueryFromSource(source, profile)
    User.findOneAndUpdate(query, update, opts)
      .then(user => resolve(user))
      .catch(err => {
        handleError(err, res, 1002)
        reject(err)
      })
  })
}

/**
 * Determines the correct Database query based on the login strategy
 * @param {string} source - source string (instagram, facebook, email)
 * @param {object} p - know attributes about the user
 */
function determineQueryFromSource(source, p) {
  let { email, id } = p
  let query = {}
  if (source === 'email') query = { email }
  else if (source === 'instagram') query = { 'instagram.id': id }
  else query = { 'facebook.id': id }
  return query
}

/**
 * Determines the correct Database payload to be sent based on user login strategy
 * @param {string} source - source string (instagram, facebook, email)
 * @param {object} user - know attributes about the user
 */
function determinePayloadFromSource(source, user) {
  let { value, displayName } = user
  let payload = { value, displayName, source }
  if (source === 'email') payload.email = user.email
  else if (source === 'instagram') payload.id = user.instagram.id
  else payload.id = user.facebook.id
  return payload
}

/**
 * Maps disperate responses from login sources to unified object model for database.
 * @param {string} source - source string (instagram, facebook, email)
 * @param {object} p - known attributes about a user
 */
function loginMapper(source, p) {
  console.log('INCOMING === ', p)
  let result = {
    ...p,
    source: source,
    email: p.email,
    displayName: p.displayName || p.username || p.name,
    photo: p.profile_picture
  }
  if (source === 'instagram') {
    result.instagram = {
      id: p.id,
      bio: p.bio,
      website: p.website,
      username: p.username,
      displayName: p.displayName || p.username
    }
  }
  if (source === 'facebook') {
    result.facebook = {
      id: p.id
    }
  }
  console.log('OUTGOING === ', result)
  return result
}
module.exports = {
  findUser,
  findOrCreateUser,
  findOneAndUpdate,
  determinePayloadFromSource,
  determineQueryFromSource
}
