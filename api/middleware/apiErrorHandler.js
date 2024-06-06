// middleware/apiErrorHandler.js
const apiErrorHandler = (err, req, res, next) => {
    if (err.response) {
      res.status(500).json({ error: 'External API failed', details: err.message });
    } else {
      next(err);
    }
  };
  
  module.exports = apiErrorHandler;
  