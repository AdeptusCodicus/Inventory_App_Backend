import { registerUser, loginUser, logoutUser, verifyToken } from '../controllers/authController.js';

// This function is exported and will be registered in app.js
export default async function authRoutes(server) {
  // All routes below are relative to the /api/auth prefix (defined in app.js)

  server.post('/register', registerUser);
  server.post('/login', loginUser);
  server.post('/logout', logoutUser);

  // Protected route to verify token
  server.get('/verify', {
    preHandler: [server.authenticate],
  }, verifyToken);
}