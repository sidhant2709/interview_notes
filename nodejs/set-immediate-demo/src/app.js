// src/app.js
import express from 'express';
import routes from './routes.js';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs/promises';
import yaml from 'yaml';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerPath = path.join(__dirname, '../docs/swagger.yaml');
const swaggerYaml = await fs.readFile(swaggerPath, 'utf8');
const swaggerDocument = yaml.parse(swaggerYaml);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());
app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📚 Swagger docs at http://localhost:${PORT}/api-docs`);
});
