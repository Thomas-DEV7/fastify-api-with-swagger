import { app } from '../src/server';
import supertest from 'supertest';

describe('User API', () => {
  test('GET /users - Should return an array of users', async () => {
    const response = await supertest(app.server).get('/users');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true); // Deve ser um array
  });

  test('POST /users - Should create a user', async () => {
    const newUser = { name: 'Thomas', email: 'thomas@example.com' };
    const response = await supertest(app.server).post('/users').send(newUser);

    expect(response.status).toBe(201); // Status esperado: 201
    expect(response.body.message).toBe('User created successfully');
  });
});
