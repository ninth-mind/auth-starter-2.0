const CronJob = require('cron').CronJob
const User = require('./user')
const config = require('../config').cron

/**
 * Sets up cron job to clear users that have not confirmed their emails.
 */
console.log(`Starting Cron Job with:  ${config.cronPattern}`)

const job = new CronJob(config.cronPattern, async function() {
  let r = await User.deleteInactiveUsers()
  console.log(`Cron complete`, r)
})
job.start()
