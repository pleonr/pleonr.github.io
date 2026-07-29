import db from '../db.js';

export function criar({ nome, email, senhaHash }) {
  const stmt = db.prepare(
    'INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)'
  );
  const info = stmt.run(nome, email, senhaHash);
  return buscarPorId(info.lastInsertRowid);
}

export function listar() {
  return db.prepare('SELECT id, nome, email, criado_em FROM usuarios').all();
}

export function buscarPorId(id) {
  return db
    .prepare('SELECT id, nome, email, criado_em FROM usuarios WHERE id = ?')
    .get(id);
}

export function buscarPorEmail(email) {
  return db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);
}

export function atualizar(id, { nome, email, senhaHash }) {
  db.prepare(
    'UPDATE usuarios SET nome = ?, email = ?, senha_hash = ? WHERE id = ?'
  ).run(nome, email, senhaHash, id);
  return buscarPorId(id);
}

export function atualizarParcial(id, campos) {
  const atual = db.prepare('SELECT * FROM usuarios WHERE id = ?').get(id);
  if (!atual) return null;

  const nome = campos.nome ?? atual.nome;
  const email = campos.email ?? atual.email;
  const senhaHash = campos.senhaHash ?? atual.senha_hash;

  db.prepare(
    'UPDATE usuarios SET nome = ?, email = ?, senha_hash = ? WHERE id = ?'
  ).run(nome, email, senhaHash, id);
  return buscarPorId(id);
}

export function remover(id) {
  const info = db.prepare('DELETE FROM usuarios WHERE id = ?').run(id);
  return info.changes > 0;
}
