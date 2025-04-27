import cors from '@fastify/cors';
import authMiddleware from './middleware/middleware.js';

// Route files
import itemRoutes from './routes/itemRoutes.js';
import authRoutes from './routes/authRoutes.js';
import stockRoutes from './routes/stockRoutes.js';
import reportRoutes from './routes/reportRoutes.js';

export default async function app(server) {
  // Register CORS
  await server.register(cors, { origin: '*' });

  await authMiddleware(server);

  // Register routes
  await server.register(authRoutes, { prefix: '/auth' });
  await server.register(itemRoutes, { prefix: '/items' });
  await server.register(stockRoutes, { prefix: '/stock' });
  await server.register(reportRoutes, { prefix: '/reports' });

  // Default route
  server.get('/', async () => {
    return { message: '📦 Inventory API is up and running' };
  });

  server.get('/routes', async () => {
    return server.printRoutes();
  });
}

