// server.js
import Fastify from 'fastify';
import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

if (!process.env.JWT_SECRET) {
  console.error('Error: JWT_SECRET is not defined in .env file');
  console.error('Please create a .env file with JWT_SECRET=your_secret_key');
  process.exit(1);
}

const server = Fastify({
  logger: true
});

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0'; // Forces IPv4

// Register app logic
await app(server);

try {
  await server.listen({ port: PORT, host: HOST });
  console.log(`🚀 Server listening on http://${HOST}:${PORT}`);
} catch (err) {
  server.log.error(err);
  process.exit(1);
}
