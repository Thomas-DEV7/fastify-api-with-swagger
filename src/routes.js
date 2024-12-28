"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = routes;
const zod_1 = __importDefault(require("zod"));
const node_crypto_1 = require("node:crypto");
const fastify = require('fastify')();
require('dotenv').config();
const users = [];
fastify.register(require('fastify-mongodb'), {
    url: process.env.MONGO_URL // Substitua pela URL de conexão do seu MongoDB
});
async function routes(app) {
    // Criar um novo usuário
    fastify.post('/users', {
        schema: {
            description: 'Create a new user',
            tags: ['Users'],
            body: zod_1.default.object({
                name: zod_1.default.string(),
                email: zod_1.default.string().email()
            }),
            response: {
                201: zod_1.default.null().describe("User created")
            }
        }
    }, async (request, reply) => {
        const { name, email } = request.body;
        // Conectando ao banco de dados e inserindo o usuário
        const db = fastify.mongo.db;
        const usersCollection = db.collection('users');
        // Inserir o novo usuário
        await usersCollection.insertOne({
            id: (0, node_crypto_1.randomUUID)(),
            name,
            email
        });
        return reply.status(201).send();
    });
    fastify.listen(3000, async (err) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        // Verificar conexão com MongoDB
        const db = fastify.mongo.db;
        try {
            await db.command({ ping: 1 });
            console.log('MongoDB connected!');
        }
        catch (e) {
            console.error('MongoDB connection failed:', e);
        }
        console.log('Server listening on http://localhost:3000');
    });
}
