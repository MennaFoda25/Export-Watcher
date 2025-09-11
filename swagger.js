// swagger.js
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Export Watcher API",
      version: "1.0.0",
      description: "API documentation for Export Watcher assessment",
    },
    servers: [
      {
        url: "http://localhost:8000/api", // Adjust if your base path is different
      },
    ],
  },
  components: {
  securitySchemes: {
    bearerAuth: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
    },
  },
},
  // Paths to files where APIs are defined with JSDoc comments
  apis: ["./routes/*.js"], 
};

const swaggerSpec = swaggerJSDoc(options);

export const swaggerDocs = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("📖 Swagger docs available at http://localhost:8000/api-docs");
};
