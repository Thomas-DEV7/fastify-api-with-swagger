import type { FastifyInstance } from "fastify";
import z, { string } from "zod";
import { FastifyTypedInstance } from "./type";
import { randomUUID } from "node:crypto";
const fastify = require('fastify')();

interface User {
    id: string,
    name: string,
    email: string
}
const users: User[] = [];
fastify.register(require('fastify-mongodb'), {
    url: 'mongodb+srv://thomas:1234@users.h8iqp.mongodb.net/users?retryWrites=true&w=majority&appName=users' // Substitua pela URL de conexão do seu MongoDB
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

    // Iniciar o servidor Fastify
    fastify.listen(3000, (err: any) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log('Server listening on http://localhost:3000');
    });
}


