import { db } from "../db.js";

// Listar todas as notícias
export const getTodasNoticias = (req, res) => {
  const query = `
    SELECT 
      NOT_Id AS id,
      NOT_Titulo AS titulo,
      NOT_Descricao AS descricao,
      NOT_Conteudo AS conteudo,
      NOT_Data AS data,
      NOT_Imagem AS imagem,
      NOT_Classificacao AS classificacao,
      NOT_Favorito AS favorito
    FROM TBL_Noticia
    ORDER BY NOT_Data DESC
  `;

  db.query(query, (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao listar notícias", details: err });
    }
    return res.status(200).json(data);
  });
};

// Buscar uma notícia por ID
export const getNoticia = (req, res) => {
  const noticiaId = parseInt(req.params.id, 10);

  if (isNaN(noticiaId)) {
    return res.status(400).json({ error: "ID da notícia inválido." });
  }

  const query = `
    SELECT 
      NOT_Id AS id,
      NOT_Titulo AS titulo,
      NOT_Descricao AS descricao,
      NOT_Conteudo AS conteudo,
      NOT_Data AS data,
      NOT_Imagem AS imagem,
      NOT_Classificacao AS classificacao,
      NOT_Favorito AS favorito
    FROM TBL_Noticia
    WHERE NOT_Id = ?
  `;

  db.query(query, [noticiaId], (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao buscar notícia", details: err });
    }
    if (data.length === 0) {
      return res.status(404).json({ error: "Notícia não encontrada." });
    }
    return res.status(200).json(data[0]);
  });
};

// Adicionar uma nova notícia
export const addNoticia = (req, res) => {
  const { titulo, descricao, conteudo, classificacao } = req.body;
  const imagem = req.file ? req.file.filename : null; // se estiver usando multer

  const query = `
    INSERT INTO TBL_Noticia (
      NOT_Titulo, NOT_Descricao, NOT_Conteudo, NOT_Imagem, NOT_Classificacao
    ) VALUES (?, ?, ?, ?, ?)
  `;

  db.query(query, [titulo, descricao, conteudo, imagem, classificacao], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao adicionar notícia", details: err });
    }
    return res.status(201).json({ message: "Notícia adicionada com sucesso." });
  });
};

// Atualizar uma notícia
export const updateNoticia = (req, res) => {
  const noticiaId = parseInt(req.params.id, 10);

  if (isNaN(noticiaId)) {
    return res.status(400).json({ error: "ID da notícia inválido." });
  }

  const { titulo, descricao, conteudo, classificacao } = req.body;
  const imagem = req.file ? req.file.filename : null;

  const query = `
    UPDATE TBL_Noticia SET
      NOT_Titulo = ?,
      NOT_Descricao = ?,
      NOT_Conteudo = ?,
      NOT_Classificacao = ?,
      ${imagem ? "NOT_Imagem = ?," : ""}
      NOT_Data = CURRENT_TIMESTAMP
    WHERE NOT_Id = ?
  `;

  const values = imagem
    ? [titulo, descricao, conteudo, classificacao, imagem, noticiaId]
    : [titulo, descricao, conteudo, classificacao, noticiaId];

  db.query(query, values, (err) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao atualizar notícia", details: err });
    }
    return res.status(200).json({ message: "Notícia atualizada com sucesso." });
  });
};

// Deletar uma notícia
export const deleteNoticia = (req, res) => {
  const noticiaId = parseInt(req.params.id, 10);

  if (isNaN(noticiaId)) {
    return res.status(400).json({ error: "ID da notícia inválido." });
  }

  const query = "DELETE FROM TBL_Noticia WHERE NOT_Id = ?";

  db.query(query, [noticiaId], (err) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao excluir notícia", details: err });
    }
    return res.status(200).json({ message: "Notícia excluída com sucesso." });
  });
};

export const getNoticiasFavoritas = (req, res) => {
  const query = `
    SELECT 
      NOT_Id AS id,
      NOT_Titulo AS titulo,
      NOT_Descricao AS descricao,
      NOT_Conteudo AS conteudo,
      NOT_Data AS data,
      NOT_Imagem AS imagem,
      NOT_Classificacao AS classificacao,
      NOT_Favorito AS favorito
    FROM TBL_Noticia
    WHERE NOT_Favorito = TRUE
    ORDER BY NOT_Data DESC
  `;

  db.query(query, (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao listar notícias favoritas", details: err });
    }
    return res.status(200).json(data);
  });
};

// Atualizar apenas o campo de favorito
export const updateFavoritoNoticia = (req, res) => {
  const noticiaId = parseInt(req.params.id, 10);
  const { favorito } = req.body;

  if (isNaN(noticiaId)) {
    return res.status(400).json({ error: "ID inválido." });
  }

  const query = `UPDATE TBL_Noticia SET NOT_Favorito = ? WHERE NOT_Id = ?`;

  db.query(query, [favorito, noticiaId], (err) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao atualizar favorito", details: err });
    }
    return res.status(200).json({ message: "Favorito atualizado com sucesso." });
  });
};
