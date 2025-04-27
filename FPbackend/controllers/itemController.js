import {
  addItem,
  getAllItems,
  getItemByBarcode,
  updateItemQuantity,
  deleteItem,
  searchItems,
  getLowStockItems
} from '../models/itemModel.js';

export async function handleAddItem(request, reply) {
  try {
    await addItem(request.body);
    reply.code(201).send({ message: 'Item added successfully.' });
  } catch (err) {
    reply.code(500).send({ error: 'Failed to add item.', details: err.message });
  }
}

export async function handleGetItems(request, reply) {
  try {
    const items = await getAllItems();
    reply.send(items);
  } catch (err) {
    reply.code(500).send({ error: 'Failed to fetch items.' });
  }
}

export async function handleGetItemByBarcode(request, reply) {
  try {
    const item = await getItemByBarcode(request.params.barcode);
    item ? reply.send(item) : reply.code(404).send({ error: 'Item not found.' });
  } catch (err) {
    reply.code(500).send({ error: 'Failed to fetch item.' });
  }
}

export async function handleUpdateQuantity(request, reply) {
  try {
    const { barcode } = request.params;
    const { quantity } = request.body;
    await updateItemQuantity(barcode, quantity);
    reply.send({ message: 'Quantity updated.' });
  } catch (err) {
    reply.code(500).send({ error: 'Failed to update quantity.' });
  }
}

export async function handleDeleteItem(request, reply) {
  try {
    await deleteItem(request.params.barcode);
    reply.send({ message: 'Item deleted.' });
  } catch (err) {
    reply.code(500).send({ error: 'Failed to delete item.' });
  }
}

export async function handleSearchItems(request, reply) {
  try {
    const { query } = request.query;
    const items = await searchItems(query);
    reply.send(items);
  } catch (err) {
    reply.code(500).send({ error: 'Search failed.' });
  }
}

export async function handleLowStockItems(request, reply) {
  try {
    const items = await getLowStockItems();
    reply.send(items);
  } catch (err) {
    reply.code(500).send({ error: 'Failed to get low stock items.' });
  }
}
