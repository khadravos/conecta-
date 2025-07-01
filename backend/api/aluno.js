import { db } from "../db.js";

// Listar todos os alunos
export const getAlunos = (_, res) => {
  const query = `
    SELECT 
      a.ALN_Id, a.ALN_CPF, a.ALN_Nome_Completo, a.ALN_Data_Nascimento, 
      a.ALN_Serie, a.ALN_Turno, a.ALN_Deficiencia, a.ALN_Medicamento, 
      a.ALN_Alergia, a.ALN_Raca, a.ALN_Sexo, a.ALN_ativo, 
      r.RES_Id, r.RES_CPF, r.RES_Nome_Completo AS RES_Nome_Completo, 
      e.ESC_Id, e.ESC_Nome
    FROM TBL_Aluno a
    JOIN TBL_Responsavel r ON a.ALN_Fk_Responsavel = r.RES_Id
    JOIN TBL_Escola e ON a.ALN_Fk_Escola = e.ESC_Id
  `;

  db.query(query, (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao buscar alunos", details: err });
    }
    return res.status(200).json(data);
  });
};

export const getAlunoById = (req, res) => {
  const { id } = req.params; // Obtém o ID do aluno da URL

  const query = `
    SELECT 
      a.ALN_Id, a.ALN_CPF, a.ALN_Nome_Completo, a.ALN_Data_Nascimento, 
      a.ALN_Serie, a.ALN_Turno, a.ALN_Deficiencia, a.ALN_Medicamento, 
      a.ALN_Alergia, a.ALN_Raca, a.ALN_Sexo, 
      r.RES_Id, r.RES_CPF, r.RES_Nome_Completo AS RES_Nome_Completo, 
      r.RES_Data_Nascimento AS RES_Data_Nascimento, r.RES_CEP, r.RES_Cidade, 
      r.RES_Rua, r.RES_Numero, r.RES_Bairro, r.RES_Complemento, r.RES_Beneficios,
      e.ESC_Id, e.ESC_Nome, e.ESC_CEP, e.ESC_Rua, e.ESC_Numero, e.ESC_Bairro, 
      e.ESC_Complemento, e.ESC_Contato,
      GROUP_CONCAT(o.OFC_Nome) AS Oficinas,
      IFNULL(GROUP_CONCAT(c.CONT_Tipo), '') AS Tipos_Contato,
      IFNULL(GROUP_CONCAT(c.CONT_numero), '') AS Contatos_Numero,
      IFNULL(GROUP_CONCAT(c.CONT_dono), '') AS Contatos_Dono
    FROM TBL_Aluno a
    JOIN TBL_Responsavel r ON a.ALN_Fk_Responsavel = r.RES_Id
    JOIN TBL_Escola e ON a.ALN_Fk_Escola = e.ESC_Id
    LEFT JOIN TBL_Matricula_Oficina m ON m.MAT_Fk_Aluno = a.ALN_Id
    LEFT JOIN TBL_Oficina o ON o.OFC_Id = m.MAT_Fk_Oficina
    LEFT JOIN TBL_Contato c ON c.CONT_Fk_Aluno = a.ALN_Id
    WHERE a.ALN_Id = ?
    GROUP BY a.ALN_Id, r.RES_Id, e.ESC_Id;
  `;

  db.query(query, [id], (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao buscar aluno", details: err });
    }
    if (data.length === 0) {
      return res.status(404).json({ message: "Aluno não encontrado" });
    }

    const aluno = data[0];
    const alunoCompleto = {
      aluno: {
        id: aluno.ALN_Id, // Incluindo o ID do aluno
        nomeCompleto: aluno.ALN_Nome_Completo,
        cpf: aluno.ALN_CPF,
        dataNascimento: aluno.ALN_Data_Nascimento,
        raca: aluno.ALN_Raca,
        sexo: aluno.ALN_Sexo,
        serie: aluno.ALN_Serie,
        turno: aluno.ALN_Turno,
        deficiencia: aluno.ALN_Deficiencia,
        medicamento: aluno.ALN_Medicamento,
        alergia: aluno.ALN_Alergia,
        responsavel: {
          id: aluno.RES_Id, // Incluindo o ID do responsável
          nomeCompleto: aluno.RES_Nome_Completo,
          cpf: aluno.RES_CPF,
          dataNascimento: aluno.RES_Data_Nascimento,
          cep: aluno.RES_CEP,
          cidade: aluno.RES_Cidade,
          rua: aluno.RES_Rua,
          numero: aluno.RES_Numero,
          bairro: aluno.RES_Bairro,
          complemento: aluno.RES_Complemento,
          beneficios: aluno.RES_Beneficios,
        },
        escola: {
          id: aluno.ESC_Id, // Incluindo o ID da escola
          nome: aluno.ESC_Nome,
          cep: aluno.ESC_CEP,
          rua: aluno.ESC_Rua,
          numero: aluno.ESC_Numero,
          bairro: aluno.ESC_Bairro,
          complemento: aluno.ESC_Complemento,
          contato: aluno.ESC_Contato,
        },
        oficinas: aluno.Oficinas ? aluno.Oficinas.split(',') : [],
        contatos: aluno.Tipos_Contato
          ? aluno.Tipos_Contato.split(',').map((tipo, index) => ({
              tipo,
              numero: aluno.Contatos_Numero.split(',')[index],
              dono: aluno.Contatos_Dono.split(',')[index],
            }))
          : [],
      },
    };

    return res.status(200).json(alunoCompleto);
  });
};



export const addAluno = (req, res) => {
  const {
    cpf, nomeCompleto, dataNascimento, serie, turno, deficiencia,
    medicamento, alergia, raca, sexo, ALN_Fk_Responsavel, ALN_Fk_Escola
  } = req.body;

  // Verificação de campos obrigatórios
  if (!cpf || !nomeCompleto || !dataNascimento || !ALN_Fk_Responsavel || !ALN_Fk_Escola) {
    return res.status(400).json({ error: "Faltando campos obrigatórios." });
  }

  const queryAluno = `
    INSERT INTO TBL_Aluno (
      ALN_CPF, ALN_Nome_Completo, ALN_Data_Nascimento, ALN_Serie, ALN_Turno,
      ALN_Deficiencia, ALN_Medicamento, ALN_Alergia, ALN_Raca, ALN_Sexo,
      ALN_Fk_Responsavel, ALN_Fk_Escola, ALN_ativo
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const valuesAluno = [
    cpf, nomeCompleto, dataNascimento, serie, turno, deficiencia,
    medicamento, alergia, raca, sexo, ALN_Fk_Responsavel, ALN_Fk_Escola, true
  ];

  db.query(queryAluno, valuesAluno, (err, resultAluno) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao adicionar aluno", details: err });
    }

    return res.status(201).json({
      message: "Aluno criado com sucesso.",
      alunoId: resultAluno.insertId
    });
  });
};


export const updateAluno = (req, res) => {
  const query = `
    UPDATE TBL_Aluno SET 
      ALN_CPF = ?, 
      ALN_Nome_Completo = ?, 
      ALN_Data_Nascimento = ?, 
      ALN_Serie = ?, 
      ALN_Turno = ?, 
      ALN_Deficiencia = ?, 
      ALN_Medicamento = ?, 
      ALN_Alergia = ?, 
      ALN_Raca = ?, 
      ALN_Sexo = ?, 
      ALN_Fk_Responsavel = ?, 
      ALN_Fk_Escola = ?
    WHERE ALN_Id = ?`;

  const values = [
    req.body.cpf,
    req.body.nomeCompleto,
    req.body.dataNascimento,
    req.body.serie,
    req.body.turno,
    req.body.deficiencia,
    req.body.medicamento,
    req.body.alergia,
    req.body.raca,
    req.body.sexo,
    req.body.responsavelId,  // Responsável ID vindo do corpo da requisição
    req.body.escolaId,       // Escola ID vindo do corpo da requisição
    req.params.id            // ID do aluno na URL
  ];

  db.query(query, values, (err) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao atualizar aluno", details: err });
    }
    return res.status(200).json({ message: "Aluno atualizado com sucesso." });
  });
};
// Deletar aluno
export const deleteAluno = (req, res) => {
  const alunoId = parseInt(req.params.id, 10);
  if (isNaN(alunoId)) {
    return res.status(400).json({ error: "ID inválido." });
  }

  // Exclusão do aluno
  const queryAluno = "DELETE FROM TBL_Aluno WHERE ALN_Id = ?";
  db.query(queryAluno, [alunoId], (err) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao excluir aluno", details: err });
    }
    return res.status(200).json({ message: "Aluno excluído com sucesso." });
  });
};

export const updateAlunoAtivo = (req, res) => {
  const alunoId = req.params.id;
  const { ativo } = req.body;

  const query = `UPDATE TBL_Aluno SET ALN_ativo = ? WHERE ALN_Id = ?`;
  db.query(query, [ativo, alunoId], (err) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao atualizar status", details: err });
    }
    res.status(200).json({ message: "Status atualizado com sucesso." });
  });
};