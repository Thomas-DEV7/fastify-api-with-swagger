"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("../src/server");
const supertest_1 = __importDefault(require("supertest"));
describe('User API', () => {
    test('GET /users - Should return an array of users', async () => {
        const response = await (0, supertest_1.default)(server_1.app.server).get('/users');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true); // Deve ser um array
    });
    test('POST /users - Should create a user', async () => {
        const newUser = { name: 'Thomas', email: 'thomas@example.com' };
        const response = await (0, supertest_1.default)(server_1.app.server).post('/users').send(newUser);
        expect(response.status).toBe(201); // Status esperado: 201
        expect(response.body.message).toBe('User created successfully');
    });
});
