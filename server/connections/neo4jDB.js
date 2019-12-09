const neo4j = require('neo4j-driver')
const config = require('../config').database.neo4j
const { handleError } = require('../lib/utils')

const driver = neo4j.driver(
  'bolt://localhost',
  neo4j.auth.basic('neo4j', config.password)
)

module.exports = {
  driver,
  async connect() {
    let session = driver.session()
    try {
      await session.run('CREATE INDEX ON :User(id)')
      // eslint-disable-next-line
      console.log('Connected to GRAPH database')
    } catch (err) {
      session.close()
      // eslint-disable-next-line
      console.log('ERROR Connecting to GRAPH database', err)
      handleError(err)
    }
  }
}
