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
    },
    production: {
      env: process.env.NODE_ENV,
      appName: 'jamieskinner.me',
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
      tempTokenExpiryTime: '10min',
      cookieName: 'jamieskinner.me',
      cookieExpiration: 4 * 3600000, // 1 hour
      captchaSecretKey: process.env.CAPTCHA_SECRET_KEY,
      captchaThreshold: 0.01
    },
    development: {
      secret: process.env.SECRET,
      tokenExpiryTime: '1hr',
      tempTokenExpiryTime: '10min',
      cookieName: 'jamieskinner.me',
      cookieExpiration: 4 * 3600000, // 1 hour
      captchaSecretKey: process.env.CAPTCHA_SECRET_KEY,
      captchaThreshold: 0.01
    },
    production: {
      secret: process.env.SECRET,
      tokenExpiryTime: '24hr',
      tempTokenExpiryTime: '10min',
      cookieName: 'jamieskinner.me',
      cookieExpiration: 72 * 3600000, // 72 hours
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
