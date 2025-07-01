import { db } from "../db.js";

// Listar todos os professores
export const getProfessores = (_, res) => {
  const query = `
    SELECT 
      PRO_Id, PRO_Nome, PRO_Email, PRO_Celular, PRO_CPF
    FROM TBL_Professor_Voluntario
  `;

  db.query(query, (err, data) => {
    if (err) {
      console.error('Erro ao buscar professores:', err);
      return res.status(500).json({ error: "Erro ao buscar professores", details: err });
    }
    return res.status(200).json(data); // Certificando que os dados são retornados corretamente
  });
};

export const getProfessorByNome = (req, res) => {
  const nome = req.query.nome;

  if (!nome) {
    return res.status(400).json({ error: "Nome não fornecido." });
  }

  const query = `SELECT PRO_Id, PRO_Nome FROM TBL_Professor_Voluntario WHERE PRO_Nome = ? LIMIT 1`;

  db.query(query, [nome], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao buscar professor", details: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Professor não encontrado." });
    }

    return res.status(200).json(results[0]);
  });
};

export const getHorariosDoProfessor = (req, res) => {
  const professorId = req.params.id;

  const query = `
    SELECT OFC_Dia, OFC_Hora_Inicio, OFC_Hora_Fim 
    FROM TBL_Oficina 
    WHERE OFC_Fk_Professor = ?
  `;

  db.query(query, [professorId], (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao buscar horários do professor", details: err });
    }

    return res.status(200).json(data);
  });
};

export const createProfessor = (req, res) => {
  const { nome, cpf, email, celular } = req.body;

  // Verificar se os campos obrigatórios foram preenchidos
  if (!nome || !cpf || !email || !celular) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  const sql = `
    INSERT INTO TBL_Professor_Voluntario (PRO_Nome, PRO_CPF, PRO_Email, PRO_Celular)
    VALUES (?, ?, ?, ?)
  `;

  // Executar a consulta SQL para inserir o professor
  db.query(sql, [nome, cpf, email, celular], (err, result) => {
    if (err) {
      console.error("Erro ao cadastrar professor:", err);
      return res.status(500).json({ error: "Erro ao cadastrar professor", details: err });
    }

    // Verificar se o professor foi cadastrado corretamente
    res.status(201).json({ message: "Professor cadastrado com sucesso!" });
  });
};


export const getProfessorById = (req, res) => {
  const { id } = req.params;

  const query = `SELECT PRO_Id, PRO_Nome, PRO_Email, PRO_Celular, PRO_CPF FROM TBL_Professor_Voluntario WHERE PRO_Id = ? LIMIT 1`;

  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao buscar professor", details: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Professor não encontrado" });
    }

    // Formatação dos dados para um formato mais amigável
    const professor = results[0];
    const professorData = {
      id: professor.PRO_Id,
      nome: professor.PRO_Nome,
      email: professor.PRO_Email,
      celular: professor.PRO_Celular,
      cpf: professor.PRO_CPF,
    };

    return res.status(200).json(professorData); // Retorna os dados com nomes amigáveis
  });
};



export const updateProfessor = (req, res) => {
  const { id } = req.params;
  const { nome, email, celular, cpf } = req.body;

  if (!nome || !email || !celular || !cpf) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  const sql = `
    UPDATE TBL_Professor_Voluntario
    SET PRO_Nome = ?, PRO_Email = ?, PRO_Celular = ?, PRO_CPF = ?
    WHERE PRO_Id = ?
  `;

  db.query(sql, [nome, email, celular, cpf, id], (err, result) => {
    if (err) {
      console.error("Erro ao atualizar professor:", err);
      return res.status(500).json({ error: "Erro ao atualizar professor", details: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Professor não encontrado." });
    }

    return res.status(200).json({ message: "Professor atualizado com sucesso!" });
  });
};

