module.exports = {
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
  }
}
