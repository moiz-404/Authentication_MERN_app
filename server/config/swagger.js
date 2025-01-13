// config/swagger.js
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Authentication API Documentation',
      version: '1.0.0',
      description: 'API to handle authentication, including login and token refresh.',
    },
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'jwt',
        },
      },
    },
    servers: [
      {
        url: 'http://localhost:3500',
        description: 'Development server',
      },
    ],
  },
  apis: [path.join(__dirname, '../routes/**/*.js')], // Adjust to your routes' directory
};

export default swaggerOptions;
