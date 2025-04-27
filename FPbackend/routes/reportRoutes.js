import { reportByItemAndType, reportByItemName, reportByCategory, reportTotalsByType, reportSales } from '../controllers/reportController.js';

export default async function reportRoutes(server) {
  const protectedRoutes = {
    preHandler: [server.authenticate, server.authorizeMultiple(['admin'])],
  }  

  server.get('/grouped/item-type', protectedRoutes,  reportByItemAndType);
  server.get('/grouped/item-name', protectedRoutes, reportByItemName);
  server.get('/grouped/category', protectedRoutes, reportByCategory);
  server.get('/totals/type', protectedRoutes, reportTotalsByType);
  server.get('/sales', protectedRoutes, reportSales);
}