module.exports = {
  env: process.env.NODE_ENV,
  mongo: {
    uri: process.env.MONGO_URI
  },
  port: process.env.PORT,
  logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
  jwtSecret: process.env.JWT_SECRET,
  jwtExpirationInterval: process.env.JWT_EXPIRATION_MINUTES,
  jobTypes: process.env.JOB_TYPES,
  fcmServerKey: process.env.FCM_SERVER_KEY
}