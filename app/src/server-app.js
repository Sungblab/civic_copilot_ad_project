import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { analyzeIncident } from './analyzer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, '..', 'public');

export function createApp() {
  const app = express();

  app.use(express.json({ limit: '1mb' }));
  app.use(express.static(publicDir));

  app.post('/api/analyze', (req, res) => {
    const input = normalizeAnalyzeInput(req.body);
    const result = analyzeIncident(input);
    res.json({ input, ...result });
  });

  app.use((error, req, res, next) => {
    if (error instanceof SyntaxError && 'body' in error) {
      res.status(400).json({ error: 'invalid_json', message: 'Request body must be valid JSON.' });
      return;
    }
    next(error);
  });

  return app;
}

function normalizeAnalyzeInput(body = {}) {
  return {
    scenario: typeof body.scenario === 'string' ? body.scenario : 'unknown',
    location: typeof body.location === 'string' ? body.location : '',
    description: typeof body.description === 'string' ? body.description : ''
  };
}
