import allowedOrigins from '../config/allowed-origins.js';

/**
 * Middleware to handle `Access-Control-Allow-Credentials` for specific origins.
 * This is used to allow cross-origin requests with credentials (like cookies or HTTP authentication).
 */
const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    /**
     * If the request's origin is in the `allowedOrigins` list, 
     * the `Access-Control-Allow-Credentials` header is added to the response.
     */
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Credentials', 'true');
    }
    next();
};

export default credentials;
