// config/swagger.js
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API documentation for the server application',
    },
    components: {
        securitySchemes: {
            BearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
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
