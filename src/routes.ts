import { FastifyTypedInstance } from "./type";
import { randomUUID } from "node:crypto";
import z from "zod";

export async function routes(app: FastifyTypedInstance) {
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
        201: z.null().describe("User created"),
        500: z.object({
          error: z.string()
        }).describe("Internal server error")
      }
    }
  }, async (request, reply) => {
    const { name, email } = request.body;

    // Conectando ao banco de dados MongoDB
    const db = app.mongo.db;

    if (!db) {
      return reply.status(500).send({ error: 'Database connection is not available' });
    }

    const usersCollection = db.collection('users');

    // Inserir o novo usuário no banco de dados
    await usersCollection.insertOne({
      id: randomUUID(),
      name,
      email
    });

    return reply.status(201).send();  // Retorno com status 201 para indicar sucesso
  });
}
