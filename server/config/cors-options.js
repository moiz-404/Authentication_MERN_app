import allowedOrigins from './allowed-origins.js';

/**
 * CORS (Cross-Origin Resource Sharing) configuration object.
 * This defines the settings for handling cross-origin requests.
 */
const corsOptions = {
    /**
     * Specifies which origins are allowed to access the server.
     * If the origin is in the `allowedOrigins` list or there's no origin (e.g., in Postman or server-to-server requests), it's allowed.
     * Otherwise, it returns an error.
     */
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true); // Allow request
        } else {
            callback(new Error('Not allowed by CORS')); // Deny request
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    /**
     * List of headers that clients are allowed to send in requests.
     */
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Cache-Control',
        'Expires',
        'Pragma',
        'Origin',
        'Accept'
    ],
    /**
     * Allows the server to include credentials (cookies, authorization headers) in cross-origin requests.
     */
    credentials: true,
    optionsSuccessStatus: 200,
};

export default corsOptions;
