import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as usuarioModel from '../models/usuarioModel.js';
import ApiError from '../errors/apiError.js';
import { JWT_SECRET } from '../middlewares/auth.js';

export async function registrar(req, res) {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    throw new ApiError(400, 'VALIDATION_ERROR', "Os campos 'nome', 'email' e 'senha' são obrigatórios.");
  }

  if (usuarioModel.buscarPorEmail(email)) {
    throw new ApiError(409, 'EMAIL_IN_USE', 'Este e-mail já está cadastrado.');
  }

  const senhaHash = await bcrypt.hash(senha, 10);
  const usuario = usuarioModel.criar({ nome, email, senhaHash });

  res.status(201).location(`/usuarios/${usuario.id}`).json(usuario);
}

export async function login(req, res) {
  const { email, senha } = req.body;

  const usuario = usuarioModel.buscarPorEmail(email);
  const senhaValida = usuario && (await bcrypt.compare(senha, usuario.senha_hash));

  if (!senhaValida) {
    throw new ApiError(401, 'INVALID_CREDENTIALS', 'E-mail ou senha inválidos.');
  }

  const token = jwt.sign(
    { sub: usuario.id, nome: usuario.nome, email: usuario.email },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token });
}
