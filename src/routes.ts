import type { FastifyInstance } from "fastify";
import z, { string } from "zod";
import { FastifyTypedInstance } from "./type";
import { randomUUID } from "node:crypto";
const fastify = require('fastify')();
require('dotenv').config();

interface User {
    id: string,
    name: string,
    email: string
}
const users: User[] = [];
fastify.register(require('fastify-mongodb'), {
    url:process.env.MONGO_URL    // Substitua pela URL de conexão do seu MongoDB
});
export async function routes(app: FastifyTypedInstance) {


    // Criar um novo usuário
    fastify.post('/users', {
        schema: {
            description: 'Create a new user',
            tags: ['Users'],
            body: z.object({
                name: z.string(),
                email: z.string().email()
            }),
            response: {
                201: z.null().describe("User created")
            }
        }
    }, async (request: any, reply: any) => {
        const { name, email } = request.body;

        // Conectando ao banco de dados e inserindo o usuário
        const db = fastify.mongo.db;
        const usersCollection = db.collection('users');

        // Inserir o novo usuário
        await usersCollection.insertOne({
            id: randomUUID(),
            name,
            email
        });

        return reply.status(201).send();
    });

    fastify.listen(3000, async (err: any) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        // Verificar conexão com MongoDB
        const db = fastify.mongo.db;
        try {
            await db.command({ ping: 1 });
            console.log('MongoDB connected!');
        } catch (e) {
            console.error('MongoDB connection failed:', e);
        }

        console.log('Server listening on http://localhost:3000');
    });

}


