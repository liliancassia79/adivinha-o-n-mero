const request = require('supertest');
const fs = require('fs');
const path = require('path');

const tmpFile = path.join(__dirname, '..', 'data', 'test-highscores.json');

function clearTestFile() {
  try {
    if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
  } catch (err) {
    // noop: arquivo pode não existir durante limpeza de teste
  }
}

describe('API Endpoints', () => {
  let app;

  beforeAll(() => {
    process.env.PERSISTENCE_FILE = tmpFile;
    clearTestFile();
    app = require('../server');
  });

  afterAll(() => {
    clearTestFile();
  });

  test('GET /api/high-scores returns array', async () => {
    const res = await request(app).get('/api/high-scores');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/guess with invalid payload returns 400', async () => {
    const res = await request(app).post('/api/guess').send({ palpite: 'abc' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('POST /api/high-scores saves and returns top-5', async () => {
    // save a few scores
    const people = [
      { nome: 'Alice', tentativas: 5 },
      { nome: 'Bob', tentativas: 3 },
      { nome: 'Carol', tentativas: 8 }
    ];

    for (const p of people) {
      const res = await request(app).post('/api/high-scores').send(p);
      expect([200,201]).toContain(res.statusCode);
      expect(Array.isArray(res.body)).toBe(true);
    }

    const getRes = await request(app).get('/api/high-scores');
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.length).toBeGreaterThanOrEqual(3);
    expect(getRes.body[0].tentativas).toBeLessThanOrEqual(getRes.body[1].tentativas);
  });
});
