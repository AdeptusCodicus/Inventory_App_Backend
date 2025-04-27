import jwt from '@fastify/jwt';
import dotenv from 'dotenv';

dotenv.config();

export default async function authMiddleware(server) {
    // Register JWT with secret
    await server.register(jwt, {
        secret: process.env.JWT_SECRET,
        sign : {
            expiresIn: '12h', // Token expiration time
        },
    });

    // Auth decorator
    server.decorate('authenticate', async function (request, reply) {
        try {
            await request.jwtVerify();
        } catch (err) {
            reply.send(err);
        }
    });

    // Role-based decorator
    server.decorate('authorizeMultiple', function (roles) {
        return async function (request, reply) {
            const user = request.user;
            if (!roles.includes(user.role)) {
                return reply.code(403).send({ error: 'Forbidden' });
            }
        };
    });
}