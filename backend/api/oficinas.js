import { db } from "../db.js";

// Listar oficina por ID
export const getOficina = (req, res) => {
  const oficinaId = parseInt(req.params.id, 10);
  if (isNaN(oficinaId)) {
    return res.status(400).json({ error: "ID da oficina inválido." });
  }

  const query = `
    SELECT 
      o.OFC_Id AS id,
      o.OFC_Nome AS nome,
      o.OFC_Descricao AS descricao,
      o.OFC_Dia AS dia,
      o.OFC_Hora_inicio AS hora_inicio,
      o.OFC_Hora_fim AS hora_fim,
      o.OFC_Vagas AS vagas,
      o.OFC_Imagem_Main AS imagem_main,
      o.OFC_Imagem_Sec AS imagem_sec,
      p.PRO_Nome AS professor
    FROM TBL_Oficina o
    JOIN TBL_Professor_Voluntario p ON o.OFC_Fk_Professor = p.PRO_Id
    WHERE o.OFC_Id = ?
  `;

  db.query(query, [oficinaId], (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao buscar oficina", details: err });
    }
    if (data.length === 0) {
      return res.status(404).json({ error: "Oficina não encontrada." });
    }

    return res.status(200).json(data[0]);
  });
};


// Adicionar oficina
export const addOficina = (req, res) => {
  const {
    nome,
    descricao,
    dias,
    horaInicio,
    horaFim,
    vagas,
    professor_id,
  } = req.body;

  const imagemMain = req.files["imagemMain"]?.[0]?.filename || null;
  const imagemSec = req.files["imagemSec"]?.[0]?.filename || null;

  const sql = `
    INSERT INTO TBL_Oficina (
      OFC_Nome, OFC_Descricao, OFC_Dia, OFC_Hora_inicio, OFC_Hora_fim, OFC_Vagas, OFC_Fk_Professor,
      OFC_Imagem_Main, OFC_Imagem_Sec
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [nome, descricao, dias, horaInicio, horaFim, vagas, professor_id, imagemMain, imagemSec];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Erro ao adicionar oficina:", err);
      return res.status(500).json({ error: "Erro ao adicionar oficina", details: err });
    }
    res.status(201).json({ message: "Oficina adicionada com sucesso" });
  });
};

// Atualizar oficina
export const updateOficina = (req, res) => {

  console.log("REQ.FILES:", req.files);
  const oficinaId = parseInt(req.params.id, 10);
  if (isNaN(oficinaId)) {
    return res.status(400).json({ error: "ID da oficina inválido." });
  }

  const {
    nome,
    descricao,
    dia,
    horaInicio,
    horaFim,
    vagas,
    professorId
  } = req.body;

  const imagemMain = req.files?.imagemMain?.[0]?.filename || null;
  const imagemSec = req.files?.imagemSec?.[0]?.filename || null;

  const fields = [
    "OFC_Nome = ?",
    "OFC_Descricao = ?",
    "OFC_Dia = ?",
    "OFC_Hora_inicio = ?",
    "OFC_Hora_fim = ?",
    "OFC_Vagas = ?",
    "OFC_Fk_Professor = ?",
  ];
  const values = [nome, descricao, dia, horaInicio, horaFim, vagas, professorId];

  if (imagemMain) {
    fields.push("OFC_Imagem_Main = ?");
    values.push(imagemMain);
  }
  if (imagemSec) {
    fields.push("OFC_Imagem_Sec = ?");
    values.push(imagemSec);
  }

  values.push(oficinaId);

  const query = `UPDATE TBL_Oficina SET ${fields.join(", ")} WHERE OFC_Id = ?`;

  db.query(query, values, (err) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao atualizar oficina", details: err });
    }

    return res.status(200).json({ message: "Oficina atualizada com sucesso." });
  });
};

// Deletar oficina
export const deleteOficina = (req, res) => {
  const oficinaId = parseInt(req.params.id, 10);

  if (isNaN(oficinaId)) {
    return res.status(400).json({ error: "ID da oficina inválido." });
  }

  const query = "DELETE FROM TBL_Oficina WHERE OFC_Id = ?";

  db.query(query, [oficinaId], (err) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao excluir oficina", details: err });
    }

    return res.status(200).json({ message: "Oficina excluída com sucesso." });
  });
};

// Listar todas as oficinas
export const getTodasOficinas = (req, res) => {
  const query = `
    SELECT 
      OFC_Id, OFC_Nome, OFC_Descricao, OFC_Dia, 
      OFC_Hora_inicio, OFC_Hora_fim, OFC_Vagas, 
      OFC_Fk_Professor, OFC_Imagem_Main, OFC_Imagem_Sec
    FROM TBL_Oficina
  `;

  db.query(query, (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao listar oficinas", details: err });
    }

    return res.status(200).json(data);
  });
};
