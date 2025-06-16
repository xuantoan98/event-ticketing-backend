export const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.4',
    info: {
      title: 'Event management REST APIs',
      version: '1.0.0',
      description: 'Event Management API for IT Training Center'
    },
    servers: [
      {
        url:  `http://localhost:${process.env.PORT}/api`
      }
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization'
        }
      }
    },
    security: [{
      ApiKeyAuth: []
    }]
  },
  apis: ['./src/routes/*.ts']
};
