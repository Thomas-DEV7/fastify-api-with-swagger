import type { FastifyInstance } from "fastify";
import z, { string } from "zod";
import { FastifyTypedInstance } from "./type";
import { randomUUID } from "node:crypto";

interface User {
    id: string,
    name: string,
    email: string
}
const users: User[] = [];

export async function routes(app: FastifyTypedInstance) {



    app.get('/users', {
        schema: {
            description: 'List users',
            tags: ['Users'],
            response: {
                200: z.array(z.object({
                    id: z.string(),
                    name: z.string(),
                    email: z.string()
                }))
            }
        }
    }, async () => {
        return users;
    });

    // Criar um novo usuário
    app.post('/users', {
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
    }, async (request, reply) => {
        const { name, email } = request.body;
        users.push({
            id: randomUUID(),
            name,
            email
        });

        return reply.status(201).send();
    });

    // Obter usuário por ID
    app.get('/users/:id', {
        schema: {
            description: 'Get a user by ID',
            tags: ['Users'],
            params: z.object({
                id: z.string()
            }),
            response: {
                200: z.object({
                    id: z.string(),
                    name: z.string(),
                    email: z.string()
                }),
                404: z.null().describe("User not found")
            }
        }
    }, async (request, reply) => {
        const { id } = request.params;
        const user = users.find(user => user.id === id);

        if (!user) {
            return reply.status(404).send();
        }

        return user;
    });

    // Atualizar um usuário
    app.put('/users/:id', {
        schema: {
            description: 'Update a user by ID',
            tags: ['Users'],
            params: z.object({
                id: z.string()
            }),
            body: z.object({
                name: z.string().optional(),
                email: z.string().email().optional()
            }),
            response: {
                200: z.null().describe("User updated"),
                404: z.null().describe("User not found")
            }
        }
    }, async (request, reply) => {
        const { id } = request.params;
        const { name, email } = request.body;
        const user = users.find(user => user.id === id);

        if (!user) {
            return reply.status(404).send();
        }

        if (name) user.name = name;
        if (email) user.email = email;

        return reply.status(200).send();
    });

    // Deletar um usuário
    app.delete('/users/:id', {
        schema: {
            description: 'Delete a user by ID',
            tags: ['Users'],
            params: z.object({
                id: z.string()
            }),
            response: {
                204: z.null().describe("User deleted"),
                404: z.null().describe("User not found")
            }
        }
    }, async (request, reply) => {
        const { id } = request.params;
        const index = users.findIndex(user => user.id === id);

        if (index === -1) {
            return reply.status(404).send();
        }

        users.splice(index, 1);

        return reply.status(204).send();
    });
}


