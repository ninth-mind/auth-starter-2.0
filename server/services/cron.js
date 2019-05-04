const CronJob = require('cron').CronJob
const User = require('./user')
/**
 * Sets up cron job to clear users that have not confirmed their emails.
 */

console.log('Starting Cron Job')

const job = new CronJob('0 */2 * * * *', async function() {
  console.log(`Running Cron at ${new Date()}`)
  let r = await User.deleteInactiveUsers()
  console.log(`Cron complete`, r)
})
job.start()
