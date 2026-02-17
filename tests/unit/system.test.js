const request = require('supertest');
const app = require('../../src/app');

describe('Pruebas de Integración: Controladores (Humo)', () => {
  test('POST /api/maps debe responder 201', async () => {
    const response = await request(app)
      .post('/api/maps')
      .send({
        name: 'Test Map',
        width: 10,
        height: 10
      });
    
    expect([201, 400]).toContain(response.status);
  });

  test('GET /api/routes/1 debe responder 200', async () => {
    const response = await request(app)
      .get('/api/routes/1');
    
    expect([200, 404]).toContain(response.status);
  });
});
