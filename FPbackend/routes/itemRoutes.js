import {
  handleAddItem,
  handleGetItems,
  handleGetItemByBarcode,
  handleUpdateQuantity,
  handleDeleteItem,
  handleSearchItems,
  handleLowStockItems
} from '../controllers/itemController.js';

export default async function itemRoutes(server) {
  const protectedRoutes = {
    preHandler: [server.authenticate, server.authorizeMultiple(['admin', 'staff'])],
  };

  server.post('/add-item', protectedRoutes, handleAddItem);
  server.get('/get-all', protectedRoutes, handleGetItems);
  server.get('/search', protectedRoutes, handleSearchItems);
  server.get('/low-stock', protectedRoutes, handleLowStockItems);
  server.get('/:barcode', protectedRoutes, handleGetItemByBarcode);
  server.put('/:barcode/quantity', protectedRoutes, handleUpdateQuantity);
  server.delete('/:barcode', protectedRoutes, handleDeleteItem);
}
