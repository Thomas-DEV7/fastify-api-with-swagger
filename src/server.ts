import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import { validatorCompiler, serializerCompiler, ZodTypeProvider, jsonSchemaTransform } from 'fastify-type-provider-zod';
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifyMongo from '@fastify/mongodb';
import dotenv from 'dotenv';
import { routes } from "./routes";

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

// Criar a instância do Fastify com o tipo de provedor Zod
const app = fastify().withTypeProvider<ZodTypeProvider>();

// Configurar o compilador de serialização e validação
app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

// Conectar ao MongoDB com a URL definida no .env ou padrão local
app.register(fastifyMongo, {
    url: process.env.MONGO_URL
});

// Registrar o middleware CORS
app.register(fastifyCors, { origin: '*' });

// Configuração do Swagger para documentação
app.register(fastifySwagger, {
    openapi: {
        info: {
            title: 'Typed API with swagger',
            version: '1.0.0'
        }
    },
    transform: jsonSchemaTransform
});

app.register(fastifySwaggerUi, {
    routePrefix: '/docs',  // A URL do Swagger UI será acessível em http://localhost:3000/docs
});

// Endpoint simples para testar se o servidor está funcionando
app.get('/', async () => {
    return 'Hello World!';
});

// Registrar as rotas definidas em routes.ts
app.register(routes);

// Iniciar o servidor na porta 3000
app.listen({
    host: '0.0.0.0', // Isso faz com que o servidor escute em todas as interfaces de rede
    port: 3000
}, async (err) => {
    if (err) {
        console.error('Error starting server:', err);
        process.exit(1);
    }

    // Verificar se a conexão com o MongoDB foi estabelecida com sucesso
    const db = app.mongo.db;

    if (!db) {
        console.error('MongoDB connection is not established');
        process.exit(1);
    }

    try {
        await db.command({ ping: 1 });  // Teste de conectividade com o MongoDB
        console.log('MongoDB connected!');
    } catch (e) {
        console.error('MongoDB connection failed:', e);
        process.exit(1);  // Encerra o servidor se a conexão ao MongoDB falhar
    }

    console.log('Server listening on http://localhost:3000');
});




export { app };
