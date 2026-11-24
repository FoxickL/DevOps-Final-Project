const request = require('supertest');
const { app } = require('../src/app');

describe('HTTP routes and metrics', () => {
  test('GET / returns the project name', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('DevOps Final Project');
  });

  test('GET /health returns healthy JSON', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  test('GET /metrics exposes default metrics and request counter', async () => {
    await request(app).get('/health');
    const response = await request(app).get('/metrics');
    expect(response.status).toBe(200);
    expect(response.text).toContain('process_cpu_user_seconds_total');
    expect(response.text).toContain('http_requests_total');
    expect(response.text).toContain('route="/health"');
  });
});
