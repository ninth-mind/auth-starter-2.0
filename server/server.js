// require environment variables
require('dotenv').config()
// dependencies
const express = require('express')
const next = require('next')
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')
const { rateLimiterMiddleware } = require('./lib/middleware')
const cors = require('cors')

const ApiRouter = require('./routers/ApiRouter')

const port = process.env.PORT || 3000
const dev = process.env.NODE_ENV !== 'production'

const app = next({
  dev,
  dir: path.resolve(__dirname, '../src')
})

const handle = app.getRequestHandler()

app
  .prepare()
  .then(() => {
    // create server
    const server = express()
    server.use(cors())
    server.use(bodyParser.urlencoded({ extended: false }))
    server.use(bodyParser.json())
    server.use(cookieParser())
    server.use(helmet())
    server.use(rateLimiterMiddleware)

    server.use((req, res, next) => {
      req.locals = {
        proto: req.headers['Forwarded-Proto'],
        for: req.headers['Forwarded-For'],
        port: req.headers['Forwarded-Port'],
        host: req.headers.host,
        referer: req.headers.referer
      }
      next()
    })
    server.use('/api', ApiRouter)
    server.get('*', (req, res) => {
      return handle(req, res)
    })

    server.listen(port, err => {
      if (err) throw err
      console.log(`~~~~~~~~~~~ LOGS: ${new Date()} ~~~~~~~~~~~`)
      console.log(`Ready on http://localhost:${port}`)
      const cron = require('./services/cron')
    })
  })
  .catch(ex => {
    console.error(ex.stack)
    process.exit(1)
  })
