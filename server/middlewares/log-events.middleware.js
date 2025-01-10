// ./middleware/log-events.middleware.js
import logger from '../config/logger.js';

// Custom middleware to log incoming requests
const logEvents = (req, res, next) => {
  const { method, url, headers, body } = req;
  
  // Log the request info to the reqLog.txt file
  logger.info(`Request received: ${method} ${url} - Headers: ${JSON.stringify(headers)} - Body: ${JSON.stringify(body)}`);
  
  next(); // Proceed to the next middleware or route handler
};

export default logEvents;
