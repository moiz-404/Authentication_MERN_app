import { logEvents } from './log-events.middleware.js'; // Ensure the correct file path and extension

const errorHandler = (err, req, res, next) => {
    logEvents(`${err.name}: ${err.message}`, 'errLog.txt');
    console.error(err.stack);
    res.status(500).send(err.message);
};

export default errorHandler;
