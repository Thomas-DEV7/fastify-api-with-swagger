"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const fastify_1 = require("fastify");
const cors_1 = require("@fastify/cors");
const fastify_type_provider_zod_1 = require("fastify-type-provider-zod");
const swagger_1 = __importDefault(require("@fastify/swagger"));
const swagger_ui_1 = __importDefault(require("@fastify/swagger-ui"));
const routes_1 = require("./routes");
const app = (0, fastify_1.fastify)().withTypeProvider();
exports.app = app;
app.setSerializerCompiler(fastify_type_provider_zod_1.serializerCompiler);
app.setValidatorCompiler(fastify_type_provider_zod_1.validatorCompiler);
app.register(cors_1.fastifyCors, { origin: '*' });
app.register(swagger_1.default, {
    openapi: {
        info: {
            title: 'Typed API with swagger',
            version: '1.0.0'
        }
    },
    transform: fastify_type_provider_zod_1.jsonSchemaTransform
});
app.register(swagger_ui_1.default, {
    routePrefix: '/docs',
});
app.get('/', () => {
    return 'hello word!';
});
app.register(routes_1.routes);
app.listen({ port: 3000 }).then(() => {
    console.log('RODANDO SERVER ! ! !');
});
