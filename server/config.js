const config = {
  global: {
    default: {
      env: process.env.NODE_ENV || 'development',
      appName: 'auth-starter',
      clientURL: 'http://localhost:3000',
      serverURL: 'http://localhost:3000'
    },
    staging: {
      env: 'staging',
      appName: 'auth-starter',
      clientURL: 'http://localhost:3000',
      serverURL: 'http://localhost:3000'
    },
    production: {
      env: process.env.NODE_ENV,
      appName: 'auth-starter',
      clientURL: 'https://authstarter.herokuapp.com',
      serverURL: 'https://authstarter.herokuapp.com'
    }
  },
  database: {
    default: {
      uri: 'mongodb://localhost:27017/test',
      options: {
        // useMongoClient: true
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false
      }
    },
    development: {
      uri: 'mongodb://localhost:27017/test',
      options: {
        // useMongoClient: true
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false
      }
    },
    production: {
      uri: process.env.MONGO_URL
    }
  },
  cron: {
    default: {
      cronPattern: '0 */2 * * * *'
    }
  },
  facebook: {
    default: {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET
    }
  },
  instagram: {
    default: {
      clientID: process.env.INSTAGRAM_CLIENT_ID,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET
    }
  },
  email: {
    default: {
      emailUsername: 'auth-starter@gmail.com',
      emailHost: 'smtp.google.com',
      emailPassword: '1234567890'
    },
    development: {
      emailUsername: process.env.EMAIL_USERNAME,
      emailHost: process.env.EMAIL_HOST,
      emailPassword: process.env.EMAIL_PASSWORD
    },
    production: {
      emailUsername: process.env.EMAIL_USERNAME,
      emailHost: process.env.EMAIL_HOST,
      emailPassword: process.env.EMAIL_PASSWORD
    }
  },
  utils: {
    default: {
      secret: 'ThisIsMySuperSecureSecret',
      tokenExpiryTime: '1hr',
      tempTokenExpiryTime: '10min',
      cookieName: 'auth-starter',
      captchaSecretKey: process.env.CAPTCHA_SECRET_KEY,
      captchaThreshold: 0.01
    },
    development: {
      secret: process.env.SECRET,
      tokenExpiryTime: '1hr',
      tempTokenExpiryTime: '10min',
      cookieName: 'auth-starter',
      captchaSecretKey: process.env.CAPTCHA_SECRET_KEY,
      captchaThreshold: 0.01
    },
    production: {
      secret: process.env.SECRET,
      tokenExpiryTime: '24hr',
      tempTokenExpiryTime: '10min',
      cookieName: 'auth-starter',
      captchaSecretKey: process.env.CAPTCHA_SECRET_KEY,
      captchaThreshold: 0.01
    }
  }
}

/**
 *
 * @param {object} config - determines which objects to export
 */
function determineExport(config) {
  let env = process.env.NODE_ENV || 'development'
  let result = {}
  for (let key in config) {
    let configObj = config[key]
    result[key] = {
      ...(configObj.default || {}),
      ...configObj[env]
    }
  }
  if (env === 'development') console.log(result)
  return result
}

module.exports = determineExport(config)
