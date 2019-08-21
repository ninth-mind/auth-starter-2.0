const UserModel = require('./UserModel')
const ObjectID = require('mongoose').Types.ObjectId
const config = require('../../config')
const stripe = require('stripe')(config.stripe.secretKey)

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
async function getUsers(query = {}) {
  return await UserModel.find(query).sort({ value: -1 })
}

/**
 * Deletes inactive users that have not confirmed their email and would have an expired token.
 * (ie token is older than 10 min)
 */
async function deleteInactiveUsers() {
  let d = new Date(new Date() - 10 * 60 * 1000)
  return await UserModel.deleteMany({ confirmed: false, updatedAt: { $lt: d } })
}
/**
 * Deletes user that matches profile
 * @param {object} profile - profile of user to delete
 */
async function deleteUser(profile) {
  let query = determineQueryFromSource(profile.source, profile)
  return await UserModel.deleteOne(query)
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
    let newProf = createDatabasePayload(source, profile)
    return await UserModel.create(newProf)
  }
}

/**
 *
 * @param {string} source - source of profule
 * @param {object} profile - user profile object
 */
async function createUser(source, profile) {
  let newProf = createDatabasePayload(source, profile)
  return await UserModel.create(newProf)
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
 *
 * @param {string} source - source of user account
 * @param {object} profile - profile data to search for
 * @param {string} stripeToken - token retrieved from Stripe
 * @param {object} additionalCardInfo - any additional card info to save
 */
async function addCard(source, profile, stripeToken, additionalCardInfo) {
  const curUser = await findUser(source, { ...profile, source })
  const { customer, cards } = curUser
  if (!customer || !customer.id) {
    const newCustomer = await stripe.customers.create({
      source: stripeToken.id,
      email: profile.email
    })

    const newUser = await findOneAndUpdate(
      source,
      profile,
      {
        customer: { id: newCustomer.id },
        $push: {
          cards: {
            ...newCustomer,
            ...additionalCardInfo
          }
        }
      },
      { new: true }
    )
    return newUser
  } else if (customer && customer.id) {
    return curUser
  }
}

/**
 * Determines the correct Database query based on the login strategy
 * @param {string} source - source string (instagram, facebook, email)
 * @param {object} p - know attributes about the user
 */
function determineQueryFromSource(source, p) {
  let query = {}
  try {
    // try and create MongoDB Id
    query = { _id: new ObjectID(p.id.toString()) }
  } catch (err) {
    // try and find by social id
    if (p.id) query[`${source}.id`] = p.id
    // find by either username or email
    else {
      query.$or = [{ email: p.email }, { username: p.username }]
    }
  }
  return query
}

function createDatabasePayload(source, p) {
  let r = loginMapper(source, p)
  if (p.password) r = { ...r, password: p.password }
  return r
}

/**
 * Maps disperate responses from login sources to unified object model for database.
 * @param {string} source - source string (instagram, facebook, email)
 * @param {object} p - known attributes about a user
 */
function loginMapper(source, p) {
  let result = {
    id: p.id,
    source: source,
    email: p.email,
    name: p.name,
    username: p.username || p.displayName || p.name,
    photo: p.photo || (p.photos && p.photos[0].value)
  }
  if (source === 'instagram') {
    result.instagram = {
      id: p.id,
      bio: p.bio,
      website: p.website,
      username: p.username || p.displayName,
      displayName: p.displayName
    }
  }
  if (source === 'facebook') {
    result.email = p.email || p.emails[0].value
    result.name = p.name || `${p.name.givenName} ${p.name.familyName}`
    result.facebook = {
      id: p.id,
      photo: p.photo || (p.photos && p.photos[0].value)
    }
  }
  return result
}

module.exports = {
  createUser,
  deleteInactiveUsers,
  deleteUser,
  determineQueryFromSource,
  findOneAndUpdate,
  findOrCreateUser,
  findUser,
  getUsers,
  loginMapper
}
