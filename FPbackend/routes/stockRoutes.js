import {
  stockIn,
  stockOut,
  listSales,
  recentSales,
} from '../controllers/stockController.js';

export default async function stockRoutes(server) {
  const protectedRoutes = {
    preHandler: [server.authenticate, server.authorizeMultiple(['admin', 'staff'])],
  };

  server.post('/in', protectedRoutes, stockIn);
  server.post('/out', protectedRoutes, stockOut);
  server.get('/all', protectedRoutes, listSales);
  server.get('/recent', protectedRoutes, recentSales);
}
