const User = require('./models/UserModel')
const { handleError } = require('../lib/utils')

/**
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
            .then(user => resolve(user))
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

function determineQueryFromSource(source, p) {
  let { email, id } = p
  let query = {}
  if (source === 'email') query = { email }
  else if (source === 'instagram') query = { 'instagram.id': id }
  else if (source === 'facebook') query = { 'facebook.id': id }
  return query
}

function loginMapper(source, p) {
  let result = {
    ...p,
    source: source,
    email: p.email,
    displayName: p.username || p.displayName || p.name,
    name: p.full_name || `${p.name.givenName} ${p.name.familyName}`,
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
  console.log('OUTGOING === PROFILE OBJEcT', result)
  return result
}

module.exports = {
  findUser,
  findOrCreateUser
}
