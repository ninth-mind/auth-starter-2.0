const UserModel = require('./UserModel')
/**
 * Returns a user or null if not user is found
 * @param {string} source - source of login
 * @param {object} profile - profile
 * @param {object} res - express response object
 */

async function findUser(source, profile) {
  let query = determineQueryFromSource(source, profile)
  return await UserModel.findOne(query)
}

/**
 * Returns all users
 * @param {string} source - source of login
 * @param {object} profile - profile
 * @param {object} res - express response object
 */
async function getUsers() {
  return await UserModel.find({}).sort({ value: -1 })
}

/**
 * Finds or creates user.
 * @param {string} source - source of profile
 * @param {object} profile - user profile object to create *MUST HAVE SOURCE*
 * @param {object} res - express response object
 */
async function findOrCreateUser(source, profile) {
  let user = await findUser(source, { ...profile, source })
  if (user) return user
  else {
    let newProf = loginMapper(source, profile)
    return await UserModel.create(newProf)
  }
}

/**
 *
 * @param {string} source - source of user account
 * @param {object} profile - profile data to search for
 * @param {object} update - object to update user with
 * @param {object} opts - options object to pass query
 * @param {object} res - express response object
 */
async function findOneAndUpdate(source, profile, update, opts) {
  let query = determineQueryFromSource(source, profile)
  return await UserModel.findOneAndUpdate(query, update, opts)
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
  return result
}

module.exports = {
  findUser,
  getUsers,
  findOrCreateUser,
  findOneAndUpdate,
  determinePayloadFromSource,
  determineQueryFromSource,
  loginMapper
}
