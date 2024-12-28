import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import { validatorCompiler, serializerCompiler, ZodTypeProvider, jsonSchemaTransform } from 'fastify-type-provider-zod'
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { routes } from "./routes";

const app = fastify().withTypeProvider<ZodTypeProvider>()



app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifyCors, { origin: '*' })
app.register(fastifySwagger, {
    openapi: {
        info: {
            title: 'Typed API with swagger',
            version: '1.0.0'
        }
    },
    transform: jsonSchemaTransform
})

app.register(fastifySwaggerUi, {
    routePrefix: '/docs',

})

app.get('/', () => {
    return 'hello word!'
})

app.register(routes)
app.listen({ port: 3000 }).then(() => {
    console.log('RODANDO SERVER ! ! !')
})

