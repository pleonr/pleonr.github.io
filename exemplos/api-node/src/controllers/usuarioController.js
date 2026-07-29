import bcrypt from 'bcryptjs';
import * as usuarioModel from '../models/usuarioModel.js';
import ApiError from '../errors/apiError.js';

export function listar(req, res) {
  res.json(usuarioModel.listar());
}

export function buscarPorId(req, res) {
  const usuario = usuarioModel.buscarPorId(Number(req.params.id));
  if (!usuario) {
    throw new ApiError(404, 'NOT_FOUND', 'Usuário não encontrado.');
  }
  res.json(usuario);
}

export async function substituir(req, res) {
  const id = Number(req.params.id);
  const { nome, email, senha } = req.body;

  if (!usuarioModel.buscarPorId(id)) {
    throw new ApiError(404, 'NOT_FOUND', 'Usuário não encontrado.');
  }
  if (!nome || !email || !senha) {
    throw new ApiError(400, 'VALIDATION_ERROR', "Os campos 'nome', 'email' e 'senha' são obrigatórios.");
  }

  const outro = usuarioModel.buscarPorEmail(email);
  if (outro && outro.id !== id) {
    throw new ApiError(409, 'EMAIL_IN_USE', 'Este e-mail já está cadastrado.');
  }

  const senhaHash = await bcrypt.hash(senha, 10);
  res.json(usuarioModel.atualizar(id, { nome, email, senhaHash }));
}

export async function atualizarParcial(req, res) {
  const id = Number(req.params.id);
  const { nome, email, senha } = req.body;

  if (!usuarioModel.buscarPorId(id)) {
    throw new ApiError(404, 'NOT_FOUND', 'Usuário não encontrado.');
  }

  if (email) {
    const outro = usuarioModel.buscarPorEmail(email);
    if (outro && outro.id !== id) {
      throw new ApiError(409, 'EMAIL_IN_USE', 'Este e-mail já está cadastrado.');
    }
  }

  const senhaHash = senha ? await bcrypt.hash(senha, 10) : undefined;
  res.json(usuarioModel.atualizarParcial(id, { nome, email, senhaHash }));
}

export function remover(req, res) {
  const removido = usuarioModel.remover(Number(req.params.id));
  if (!removido) {
    throw new ApiError(404, 'NOT_FOUND', 'Usuário não encontrado.');
  }
  res.status(204).send();
}
