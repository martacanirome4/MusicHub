// No authentication middleware for testing purposes
const auth = (req, res, next) => {
  next(); // Skip authentication
};

module.exports = auth;
