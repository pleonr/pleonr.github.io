from app.db import conn


def criar(nome: str, email: str, senha_hash: str) -> dict:
    cursor = conn.execute(
        "INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)",
        (nome, email, senha_hash),
    )
    conn.commit()
    return buscar_por_id(cursor.lastrowid)


def listar() -> list[dict]:
    linhas = conn.execute("SELECT id, nome, email, criado_em FROM usuarios").fetchall()
    return [dict(linha) for linha in linhas]


def buscar_por_id(usuario_id: int) -> dict | None:
    linha = conn.execute(
        "SELECT id, nome, email, criado_em FROM usuarios WHERE id = ?", (usuario_id,)
    ).fetchone()
    return dict(linha) if linha else None


def buscar_por_email(email: str) -> dict | None:
    linha = conn.execute("SELECT * FROM usuarios WHERE email = ?", (email,)).fetchone()
    return dict(linha) if linha else None


def atualizar(usuario_id: int, nome: str, email: str, senha_hash: str) -> dict:
    conn.execute(
        "UPDATE usuarios SET nome = ?, email = ?, senha_hash = ? WHERE id = ?",
        (nome, email, senha_hash, usuario_id),
    )
    conn.commit()
    return buscar_por_id(usuario_id)


def atualizar_parcial(usuario_id: int, nome: str | None, email: str | None, senha_hash: str | None) -> dict:
    atual = conn.execute("SELECT * FROM usuarios WHERE id = ?", (usuario_id,)).fetchone()
    conn.execute(
        "UPDATE usuarios SET nome = ?, email = ?, senha_hash = ? WHERE id = ?",
        (nome or atual["nome"], email or atual["email"], senha_hash or atual["senha_hash"], usuario_id),
    )
    conn.commit()
    return buscar_por_id(usuario_id)


def remover(usuario_id: int) -> bool:
    cursor = conn.execute("DELETE FROM usuarios WHERE id = ?", (usuario_id,))
    conn.commit()
    return cursor.rowcount > 0
