import { db } from "../db.js";

// Listar dados de uma escola
export const getEscola = (req, res) => {
  const escolaId = parseInt(req.params.id, 10);

  if (isNaN(escolaId)) {
    return res.status(400).json({ error: "ID de escola inválido." });
  }

  const query = `
    SELECT ESC_Id, ESC_Nome, ESC_CEP, ESC_Rua, ESC_Numero, 
           ESC_Bairro, ESC_Complemento, ESC_Contato
    FROM TBL_Escola
    WHERE ESC_Id = ?
  `;

  db.query(query, [escolaId], (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao buscar escola", details: err });
    }
    if (data.length === 0) {
      return res.status(404).json({ error: "Escola não encontrada." });
    }
    return res.status(200).json(data[0]);
  });
};
// Adicionar escola
export const addEscola = (req, res) => {
  const query = `
    INSERT INTO TBL_Escola(
      ESC_Nome, ESC_CEP, ESC_Rua, ESC_Numero, 
      ESC_Bairro, ESC_Complemento, ESC_Contato
    ) VALUES (?)`;

  const values = [
    req.body.nome,
    req.body.cep,
    req.body.rua,
    req.body.numero,
    req.body.bairro,
    req.body.complemento,
    req.body.contato,
  ];

  db.query(query, [values], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao adicionar escola", details: err });
    }

    // Retorna o ID da escola recém-criada
    const escolaId = result.insertId;
    return res.status(201).json({ message: "Escola adicionada com sucesso.", ESC_Id: escolaId });
  });
};

// Atualizar escola
export const updateEscola = (req, res) => {
  const query = `
    UPDATE TBL_Escola SET 
      ESC_Nome = ?, 
      ESC_CEP = ?, 
      ESC_Rua = ?, 
      ESC_Numero = ?, 
      ESC_Bairro = ?, 
      ESC_Complemento = ?, 
      ESC_Contato = ?
    WHERE ESC_Id = ?`;

  const values = [
    req.body.nome,
    req.body.cep,
    req.body.rua,
    req.body.numero,
    req.body.bairro,
    req.body.complemento,
    req.body.contato,
    req.params.id,
  ];

  db.query(query, values, (err) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao atualizar escola", details: err });
    }
    return res.status(200).json({ message: "Escola atualizada com sucesso." });
  });
};
// Deletar uma escola
export const deleteEscola = (req, res) => {
  const escolaId = parseInt(req.params.id, 10);

  if (isNaN(escolaId)) {
    return res.status(400).json({ error: "ID de escola inválido." });
  }

  const query = "DELETE FROM TBL_Escola WHERE ESC_Id = ?";

  db.query(query, [escolaId], (err) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao excluir escola", details: err });
    }
    return res.status(200).json({ message: "Escola excluída com sucesso." });
  });
};
