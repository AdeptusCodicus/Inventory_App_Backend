import bcrypt from 'bcrypt';
import { createUser, getUserByUsername } from '../models/userModel.js';

const SALT_ROUNDS = 10;

// Register a new user
export async function registerUser(req, reply) {
  const { username, password, role } = req.body;

  try {
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      return reply.status(400).send({ error: 'Username already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    await createUser({ username, password: hashedPassword, role });

    reply.send({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Register error:', error);
    reply.status(500).send({ error: 'Error registering user.' });
  }
}

// Login a user
export async function loginUser(req, reply) {
  const { username, password } = req.body;

  try {
    const user = await getUserByUsername(username);
    if (!user) {
      return reply.status(401).send({ error: 'Invalid credentials.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return reply.status(401).send({ error: 'Invalid credentials.' });
    }

    const token = req.server.jwt.sign({ id: user.id, role: user.role });
    reply.send({ token });

    reply.send({ message: 'Login successful', user: { id: user.id, username: user.username, role: user.role } });
  } catch (error) {
    console.error('Login error:', error);
    reply.status(500).send({ error: 'Error logging in.' });
  }
}

export async function logoutUser(req, reply) {
  try {
    reply.send({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    reply.status(500).send({ error: 'Error logging out.' });
  }
}

export async function verifyToken(req, reply) { 
  try { 
    reply.send({ user: req.user }); 
  } 
  catch (err) { reply.status(401).send({ error: 'Invalid or expired token' }); } 
}