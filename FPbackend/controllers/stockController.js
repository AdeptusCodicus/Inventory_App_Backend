import {
  getItemByBarcode,
  updateItemQuantity,
} from '../models/itemModel.js';

import {
  recordSale,
  getSales,
  getSalesByType,
  getSalesByItem,
  getRecentSales,
} from '../models/salesModel.js';

// Handle stock IN (e.g. restocking)
export async function stockIn(req, reply) {
  const { barcode, quantity } = req.body;

  try {
    const item = await getItemByBarcode(barcode);
    if (!item) return reply.status(404).send({ error: 'Item not found' });

    const newQty = Number(item.quantity) + Number(quantity);
    await updateItemQuantity(barcode, newQty);
    await recordSale({ itemBarcode: barcode, quantity, type: 'in' });

    reply.send({ message: 'Stock added', newQuantity: newQty });
  } catch (err) {
    console.error('Stock in error:', err);
    reply.status(500).send({ error: 'Error processing stock in' });
  }
}

// Handle stock OUT (e.g. sales, usage)
export async function stockOut(req, reply) {
  const { barcode, quantity } = req.body;

  try {
    const item = await getItemByBarcode(barcode);
    if (!item) return reply.status(404).send({ error: 'Item not found' });

    if (item.quantity < quantity) {
      return reply.status(400).send({ error: 'Insufficient stock' });
    }

    const newQty = Number(item.quantity) - Number(quantity);
    await updateItemQuantity(barcode, newQty);
    await recordSale({ itemBarcode: barcode, quantity, type: 'out' });

    reply.send({ message: 'Stock deducted', newQuantity: newQty });
  } catch (err) {
    console.error('Stock out error:', err);
    reply.status(500).send({ error: 'Error processing stock out' });
  }
}

// Get all sales
export async function listSales(req, reply) {
  try {
    const sales = await getSales();
    reply.send(sales);
  } catch (err) {
    console.error('Sales list error:', err);
    reply.status(500).send({ error: 'Error fetching sales records' });
  }
}

// Get recent sales
export async function recentSales(req, reply) {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const recent = await getRecentSales(limit);
    reply.send(recent);
  } catch (err) {
    console.error('Recent sales error:', err);
    reply.status(500).send({ error: 'Error fetching recent sales' });
  }
}
