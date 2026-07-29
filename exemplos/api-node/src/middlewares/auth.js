import jwt from 'jsonwebtoken';
import ApiError from '../errors/apiError.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'segredo-de-desenvolvimento';

export function auth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return next(new ApiError(401, 'UNAUTHORIZED', 'Token ausente ou inválido.'));
  }

  const token = header.slice('Bearer '.length);

  try {
    req.usuario = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    next(new ApiError(401, 'UNAUTHORIZED', 'Token ausente ou inválido.'));
  }
}
