import { db } from "../db.js";

// Listar todos os avisos
export const getTodosAvisos = (req, res) => {
  const query = `
    SELECT 
      AVS_Id AS id,
      AVS_Titulo AS titulo,
      AVS_Descricao AS descricao
    FROM TBL_Avisos
    ORDER BY AVS_Id DESC
  `;

  db.query(query, (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao listar avisos", details: err });
    }
    return res.status(200).json(data);
  });
};

// Buscar um aviso por ID
export const getAviso = (req, res) => {
  const avisoId = parseInt(req.params.id, 10);

  if (isNaN(avisoId)) {
    return res.status(400).json({ error: "ID do aviso inválido." });
  }

  const query = `
    SELECT 
      AVS_Id AS id,
      AVS_Titulo AS titulo,
      AVS_Descricao AS descricao
    FROM TBL_Avisos
    WHERE AVS_Id = ?
  `;

  db.query(query, [avisoId], (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao buscar aviso", details: err });
    }
    if (data.length === 0) {
      return res.status(404).json({ error: "Aviso não encontrado." });
    }
    return res.status(200).json(data[0]);
  });
};

// Adicionar um novo aviso
export const addAviso = (req, res) => {
  const { titulo, descricao } = req.body;

  const query = `
    INSERT INTO TBL_Avisos (
      AVS_Titulo, AVS_Descricao
    ) VALUES (?, ?)
  `;

  db.query(query, [titulo, descricao], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao adicionar aviso", details: err });
    }
    return res.status(201).json({ message: "Aviso adicionado com sucesso." });
  });
};

// Atualizar um aviso
export const updateAviso = (req, res) => {
  const avisoId = parseInt(req.params.id, 10);

  if (isNaN(avisoId)) {
    return res.status(400).json({ error: "ID do aviso inválido." });
  }

  const { titulo, descricao } = req.body;

  const query = `
    UPDATE TBL_Avisos SET
      AVS_Titulo = ?,
      AVS_Descricao = ?
    WHERE AVS_Id = ?
  `;

  db.query(query, [titulo, descricao, avisoId], (err) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao atualizar aviso", details: err });
    }
    return res.status(200).json({ message: "Aviso atualizado com sucesso." });
  });
};

// Deletar um aviso
export const deleteAviso = (req, res) => {
  const avisoId = parseInt(req.params.id, 10);

  if (isNaN(avisoId)) {
    return res.status(400).json({ error: "ID do aviso inválido." });
  }

  const query = "DELETE FROM TBL_Avisos WHERE AVS_Id = ?";

  db.query(query, [avisoId], (err) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao excluir aviso", details: err });
    }
    return res.status(200).json({ message: "Aviso excluído com sucesso." });
  });
};
