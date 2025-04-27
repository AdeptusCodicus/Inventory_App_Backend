# FPbackend - Inventory Management System API Documentation

## Table of Contents
1. [Introduction](#introduction)
2. [System Architecture](#system-architecture)
3. [Installation and Setup](#installation-and-setup)
4. [API Endpoints](#api-endpoints)
   - [Authentication Endpoints](#authentication-endpoints)
   - [Item Management Endpoints](#item-management-endpoints)
   - [Stock Management Endpoints](#stock-management-endpoints)
   - [Reporting Endpoints](#reporting-endpoints)
5. [Data Models](#data-models)
6. [Authentication and Authorization](#authentication-and-authorization)
7. [Database](#database)
8. [Error Handling](#error-handling)
9. [Dependencies](#dependencies)

## Introduction

FPbackend is a RESTful API backend for an inventory management system built with Fastify and SQLite using the Drizzle ORM. The system allows users to manage inventory items, track stock movements (in/out), generate reports, and manage user authentication.

## System Architecture

The application follows a modular architecture with clear separation of concerns:

- **Routes**: Define API endpoints and direct requests to controllers
- **Controllers**: Handle business logic and request processing
- **Models**: Define data structures and database interactions
- **Middleware**: Handle cross-cutting concerns like authentication

The system uses Fastify as the web framework, with SQLite as the database and Drizzle ORM for database operations.

## Installation and Setup

### Prerequisites
- Node.js (version compatible with ES modules)
- npm or yarn

### Installation Steps

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following configuration:
   ```
   PORT=3000
   DB_PATH=./data/inventory.db
   ```

4. Start the server:
   ```bash
   npm start
   ```

The server will start on port 3000 by default or the port specified in the `.env` file.

## API Endpoints

### Authentication Endpoints

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|--------------|----------|
| `/api/register` | POST | Register a new user | `{ username, password, role }` | `{ message: "User registered successfully" }` |
| `/api/login` | POST | Authenticate a user | `{ username, password }` | `{ token: "JWT_TOKEN" }` |
| `/api/verify` | GET | Verify JWT token | None | `{ user: { id, role } }` |

### Item Management Endpoints

| Endpoint | Method | Description | Request Body/Params | Response |
|----------|--------|-------------|--------------|----------|
| `/api/items` | POST | Add a new item | `{ name, category, quantity, barcode, lowStockThreshold, price }` | `{ message: "Item added successfully" }` |
| `/api/items` | GET | Get all items | None | Array of items |
| `/api/items/search` | GET | Search items by name | Query param: `query` | Array of matched items |
| `/api/items/low-stock` | GET | Get items below threshold | None | Array of low-stock items |
| `/api/items/:barcode` | GET | Get item by barcode | Path param: `barcode` | Item object |
| `/api/items/:barcode/quantity` | PUT | Update item quantity | Path param: `barcode`, Body: `{ quantity }` | `{ message: "Quantity updated" }` |
| `/api/items/:barcode` | DELETE | Delete an item | Path param: `barcode` | `{ message: "Item deleted" }` |

### Stock Management Endpoints

| Endpoint | Method | Description | Request Body/Params | Response |
|----------|--------|-------------|--------------|----------|
| `/api/stock/in` | POST | Record stock in | `{ barcode, quantity }` | `{ message: "Stock added", newQuantity }` |
| `/api/stock/out` | POST | Record stock out | `{ barcode, quantity }` | `{ message: "Stock deducted", newQuantity }` |
| `/api/stock/all` | GET | List all sales records | None | Array of sales records |
| `/api/stock/recent` | GET | Get recent sales | Query param: `limit` (optional) | Array of recent sales |

### Reporting Endpoints

| Endpoint | Method | Description | Request Body/Params | Response |
|----------|--------|-------------|--------------|----------|
| `/api/reports/sales` | GET | Get sales report | Query params: `type`, `barcode`, `from`, `to` (all optional) | Array of sales records |
| `/api/reports/grouped/item-type` | GET | Sales grouped by item & type | None | Grouped sales data |
| `/api/reports/grouped/item-name` | GET | Sales grouped by item name & type | None | Grouped sales data |
| `/api/reports/grouped/category` | GET | Sales grouped by category & type | None | Grouped sales data |
| `/api/reports/totals/type` | GET | Total sales by type (in/out) | None | Sales totals |

## Data Models

### User Model

```javascript
{
  id: integer (primary key, auto-increment),
  username: text (unique, not null),
  password: text (not null, hashed),
  role: text (not null, default: 'staff')
}
```

### Item Model

```javascript
{
  id: integer (primary key, auto-increment),
  name: text (not null),
  category: text (not null),
  quantity: integer (not null),
  barcode: text (unique, not null),
  lowStockThreshold: integer (not null),
  price: real (not null)
}
```

### Sales Model

```javascript
{
  id: integer (primary key, auto-increment),
  itemBarcode: text (not null, references items.barcode),
  quantity: integer (not null),
  type: text (not null, 'in' or 'out'),
  timestamp: text (default: current ISO timestamp)
}
```

## Authentication and Authorization

The system uses JWT (JSON Web Token) for authentication. Tokens are issued upon successful login and must be included in the `Authorization` header for protected routes.

### Token Structure

The JWT payload contains:
- `id`: User ID
- `role`: User role ('admin' or 'staff')

### Authorization

Routes can be protected using the `authenticate` middleware which verifies the JWT token.

## Database

The application uses SQLite with Drizzle ORM for data persistence. The database file is stored in the `./data/inventory.db` path by default, which can be configured via the `DB_PATH` environment variable.

## Error Handling

The API provides consistent error responses in the following format:

```javascript
{
  error: "Error message",
  details: "Optional detailed error message or stack trace" // only in development
}
```

Common HTTP status codes used:
- `200` - Success
- `201` - Resource created
- `400` - Bad request
- `401` - Unauthorized
- `404` - Resource not found
- `500` - Server error

## Dependencies

The application uses the following main dependencies:

- `fastify` - Web framework
- `@fastify/cors` - CORS support
- `@fastify/jwt` - JWT authentication
- `bcrypt` - Password hashing
- `better-sqlite3` - SQLite database driver
- `drizzle-orm` - ORM for database operations
- `dotenv` - Environment variable management

For the complete list of dependencies and their versions, refer to the `package.json` file. 