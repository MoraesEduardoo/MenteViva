// src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'segredo-super-seguro';

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;  // "Bearer token"
  if (!authHeader) return res.status(401).json({ message: 'Token não informado.' });

  const [, token] = authHeader.split(' ');
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { userId, email, iat, exp }
    next();
  } catch {
    return res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
}

module.exports = authMiddleware;