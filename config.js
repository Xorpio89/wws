module.exports = {
  ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 5000,
  URL: process.env.BASE_URL || "http://localhost:5000",
  MONGODB_URI:
    process.env.MONGODB_URI ||
    "mongodb://wws:wws123@ds249503.mlab.com:49623/wws_db",
  JWT_SECRET: process.env.JWT_SECRET || "secret1"
};
