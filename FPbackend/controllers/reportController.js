// reportController.js

import {
  getSales,
  getSalesByType,
  getSalesByItem,
  getSalesByDateRange,
  getSalesGroupedByItemAndType,
  getSalesGroupedByItemName,
  getSalesGroupedByCategory,
  getSalesTotalsByType,
} from '../models/salesModel.js';

export async function reportSales(req, reply) {
  const { type, barcode, from, to } = req.query;

  try {
    if (type) {
      const result = await getSalesByType(type);
      return reply.send(result);
    }

    if (barcode) {
      const result = await getSalesByItem(barcode);
      return reply.send(result);
    }

    if (from && to) {
      const result = await getSalesByDateRange(from, to);
      return reply.send(result);
    }

    const result = await getSales();
    return reply.send(result);
  } catch (err) {
    console.error('Report error:', err);
    reply.status(500).send({ error: 'Failed to generate report' });
  }
}

// Grouped by barcode and type
export async function reportByItemAndType(req, reply) {
  try {
    const data = await getSalesGroupedByItemAndType();
    reply.send(data);
  } catch (err) {
    console.error('Report error:', err);
    reply.status(500).send({ error: 'Failed to generate report' });
  }
}

// Grouped by item name and type
export async function reportByItemName(req, reply) {
  try {
    const data = await getSalesGroupedByItemName();
    reply.send(data);
  } catch (err) {
    console.error('Report error:', err);
    reply.status(500).send({ error: 'Failed to generate report' });
  }
}

// Grouped by category and type
export async function reportByCategory(req, reply) {
  try {
    const data = await getSalesGroupedByCategory();
    reply.send(data);
  } catch (err) {
    console.error('Report error:', err);
    reply.status(500).send({ error: 'Failed to generate report' });
  }
}

// Totals by type (stock in vs stock out)
export async function reportTotalsByType(req, reply) {
  try {
    const data = await getSalesTotalsByType();
    reply.send(data);
  } catch (err) {
    console.error('Report error:', err);
    reply.status(500).send({ error: 'Failed to generate report' });
  }
}