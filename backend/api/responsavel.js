import { db } from "../db.js";

// Listar dados de um responsável
export const getResponsavel = (req, res) => {
  const responsavelId = parseInt(req.params.id, 10);

  if (isNaN(responsavelId)) {
    return res.status(400).json({ error: "ID de responsável inválido." });
  }

  const query = `
    SELECT RES_Id, RES_CPF, RES_Nome_Completo, RES_Data_Nascimento, 
            RES_CEP, RES_Rua, RES_Numero, 
           RES_Bairro, RES_Complemento, RES_Beneficios,
           RES_cidade
    FROM TBL_Responsavel
    WHERE RES_Id = ?
  `;

  db.query(query, [responsavelId], (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao buscar responsável", details: err });
    }
    if (data.length === 0) {
      return res.status(404).json({ error: "Responsável não encontrado." });
    }
    return res.status(200).json(data[0]);
  });
};

// Adicionar responsável
export const addResponsavel = (req, res) => {
  const query = `
    INSERT INTO TBL_Responsavel(
      RES_CPF, RES_Nome_Completo, RES_Data_Nascimento, RES_CEP, RES_cidade, RES_Rua, RES_Numero, 
      RES_Bairro, RES_Complemento, RES_Beneficios
    ) VALUES (?)`;

  const values = [
    req.body.cpf,
    req.body.nomeCompleto,
    req.body.dataNascimento,
    req.body.cep,
    req.body.cidade,
    req.body.rua,
    req.body.numero,
    req.body.bairro,
    req.body.complemento,
    req.body.beneficios,
  ];

  db.query(query, [values], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao adicionar responsável", details: err });
    }

    // Retorna o ID do responsável recém-criado
    const responsavelId = result.insertId;
    return res.status(201).json({ message: "Responsável adicionado com sucesso.", RES_Id: responsavelId });
  });
};

// Atualizar responsável
export const updateResponsavel = (req, res) => {
  const query = `
    UPDATE TBL_Responsavel SET 
      RES_CPF = ?, 
      RES_Nome_Completo = ?, 
      RES_Data_Nascimento = ?, 
      RES_CEP = ?, 
      RES_Rua = ?, 
      RES_Numero = ?, 
      RES_Bairro = ?, 
      RES_Complemento = ?, 
      RES_Beneficios = ?
    WHERE RES_Id = ?`;

  const values = [
    req.body.cpf,
    req.body.nomeCompleto,
    req.body.dataNascimento,
    req.body.cep,
    req.body.rua,
    req.body.numero,
    req.body.bairro,
    req.body.complemento,
    req.body.beneficios,
    req.params.id,
  ];

  db.query(query, values, (err) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao atualizar responsável", details: err });
    }
    return res.status(200).json({ message: "Responsável atualizado com sucesso." });
  });
};
// Deletar um responsável
export const deleteResponsavel = (req, res) => {
  const responsavelId = parseInt(req.params.id, 10);

  if (isNaN(responsavelId)) {
    return res.status(400).json({ error: "ID de responsável inválido." });
  }

  const query = "DELETE FROM TBL_Responsavel WHERE RES_Id = ?";

  db.query(query, [responsavelId], (err) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao excluir responsável", details: err });
    }
    return res.status(200).json({ message: "Responsável excluído com sucesso." });
  });
};
