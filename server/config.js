/**
 * NOTE: Config categories MUST HAVE A DEFAULT category to avoid errors
 */

const config = {
  global: {
    default: {
      env: process.env.NODE_ENV || 'development',
      appName: 'jamieskinner.me',
      clientURL: 'http://localhost:3000',
      serverURL: 'http://localhost:3000'
    },
    staging: {
      env: 'staging',
      appName: 'jamieskinner.me',
      clientURL: 'http://localhost:3000',
      serverURL: 'http://localhost:3000'
    }
    production: {
      env: process.env.NODE_ENV,
      appName: 'jamieskinner.me',
      clientURL: 'http://auth-test.thesuperuser.com/',
      serverURL: 'http://auth-test.thesuperuser.com/'
    }
  },
  database: {
    mongo: {
      default: {
        uri: 'mongodb://localhost:27017/test',
        options: {
          useCreateIndex: true,
          useNewUrlParser: true,
          useFindAndModify: false,
          useUnifiedTopology: true
        }
      },
      development: {
        uri: 'mongodb://localhost:27017/test',
        options: {
          useCreateIndex: true,
          useNewUrlParser: true,
          useFindAndModify: false,
          useUnifiedTopology: true
        }
      },
      production: {
        uri: process.env.MONGO_URL
      }
    },
    neo4j: {
      default: {
        password: '12341234'
      },
      production: {
        password: process.env.NEO4J_PASSWORD
      }
    }
  },
  cron: {
    default: {
      cronPattern: '0 */2 * * * *'
    }
  },
  stripe: {
    default: {
      secretKey: process.env.STRIPE_SECRET_KEY
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
      emailPassword: '1234567890',
      googleAccount: 'auth-starter@gmail.com',
      googleEmailClientID: '000000000000-xxx0.apps.googleusercontent.com',
      googleEmailClientSecret: 'XxxxxXXxX0xxxxxxxx0XXxX0',
      googleEmailRefreshToken: '1/XXxXxsss-xxxXXXXXxXxx0XXXxxXXx0x00xxx',
      googleEmailAccessToken: 'ya29.Xx_XX0xxxxx-xX0X0XxXXxXxXXXxX0x'
    },
    development: {
      emailUsername: process.env.EMAIL_USERNAME,
      emailHost: process.env.EMAIL_HOST,
      emailPassword: process.env.EMAIL_PASSWORD,
      googleAccount: process.env.GOOGLE_ACCOUNT,
      googleEmailClientID: process.env.GOOGLE_EMAIL_CLIENT_ID,
      googleEmailClientSecret: process.env.GOOGLE_EMAIL_CLIENT_SECRET,
      googleEmailRefreshToken: process.env.GOOGLE_EMAIL_REFRESH_TOKEN,
      googleEmailAccessToken: process.env.GOOGLE_EMAIL_ACCESS_TOKEN
    },
    production: {
      emailUsername: process.env.EMAIL_USERNAME,
      emailHost: process.env.EMAIL_HOST,
      emailPassword: process.env.EMAIL_PASSWORD,
      googleAccount: process.env.GOOGLE_ACCOUNT,
      googleEmailClientID: process.env.GOOGLE_EMAIL_CLIENT_ID,
      googleEmailClientSecret: process.env.GOOGLE_EMAIL_CLIENT_SECRET,
      googleEmailRefreshToken: process.env.GOOGLE_EMAIL_REFRESH_TOKEN,
      googleEmailAccessToken: process.env.GOOGLE_EMAIL_ACCESS_TOKEN
    }
  },
  utils: {
    default: {
      secret: 'ThisIsMySuperSecureSecret',
      tokenExpiryTime: '1hr',
      tempTokenExpiryTime: '30min',
      cookieName: 'jamieskinner.me',
      cookieExpiration: 4 * 3600000, // 1 hour
      captchaSecretKey: process.env.CAPTCHA_SECRET_KEY,
      captchaThreshold: 0.01
    },
    development: {
      secret: process.env.SECRET,
      tokenExpiryTime: '1hr',
      tempTokenExpiryTime: '30min',
      cookieName: 'jamieskinner.me',
      cookieExpiration: 4 * 3600000, // 1 hour
      captchaSecretKey: process.env.CAPTCHA_SECRET_KEY,
      captchaThreshold: 0.01
    },
    production: {
      secret: process.env.SECRET,
      tokenExpiryTime: '24hr',
      tempTokenExpiryTime: '30min',
      cookieName: 'jamieskinner.me',
      cookieExpiration: 72 * 3600000, // 72 hours
      captchaSecretKey: process.env.CAPTCHA_SECRET_KEY,
      captchaThreshold: 0.01
    }
  }
}

/**
 * Clean Config
 * recusively drills into configuration categories and determines exports
 * @param {object} config - determines which objects to export
 */
function cleanConfig(config, env = 'development') {
  let result = {}
  let entries = Object.entries(config)
  for (let [key, obj] of entries) {
    if (typeof obj !== 'object' || obj === null)
      throw 'No default value found in CONFIG. Check server configuration file'
    if (!obj.default) result[key] = cleanConfig(obj, env)
    else {
      result[key] = {}
      result[key] = { ...obj.default }
      let newEnvObj = obj[env]
      if (newEnvObj) {
        let lowerEntries = Object.entries(newEnvObj)
        for (let [k, e] of lowerEntries) {
          if (e || e !== undefined) {
            result[key][k] = e
          }
        }
      }
    }
  }

  console.log('CONFIG OPTIONS', result)
  return result
}

module.exports = cleanConfig(config, process.env.NODE_ENV)
