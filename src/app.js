const express = require('express');
const client = require('prom-client');

const app = express();
const register = new client.Registry();
client.collectDefaultMetrics({ register });

const requestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

app.use((request, response, next) => {
  response.once('finish', () => {
    requestsTotal.inc({
      method: request.method,
      route: request.route ? request.route.path : request.path,
      status_code: String(response.statusCode),
    });
  });
  next();
});

app.get('/', (_request, response) => response.type('text/plain').send('DevOps Final Project'));
app.get('/health', (_request, response) => response.json({ status: 'ok' }));
app.get('/metrics', async (_request, response, next) => {
  try {
    response.set('Content-Type', register.contentType);
    response.end(await register.metrics());
  } catch (error) {
    next(error);
  }
});

module.exports = { app, register };
