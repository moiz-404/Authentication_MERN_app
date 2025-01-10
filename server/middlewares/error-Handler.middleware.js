// ./middleware/error-handler.middleware.js
import logger from '../config/logger.js';

const errorHandler = (err, req, res, next) => {
    // Log the error to errLog.txt file
    logger.error(`${err.name}: ${err.message} - Stack: ${err.stack}`);
    
    // Log to the console for debugging purposes
    console.error(err.stack); 
    
    // Send the error message as the response
    res.status(500).send('Something went wrong!');
};

export default errorHandler;
