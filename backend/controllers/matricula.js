import { db } from "../db.js";

// Adiciona uma nova matrícula
export const addMatricula = (req, res) => {
    const { MAT_Fk_Oficina, MAT_Fk_Aluno, MAT_Data_Matricula, MAT_Status } = req.body;
  
    if (!MAT_Fk_Oficina || !MAT_Fk_Aluno || !MAT_Data_Matricula || !MAT_Status) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }
  
    const sql = `INSERT INTO TBL_matricula_oficina 
                  (MAT_Fk_Oficina, MAT_Fk_Aluno, MAT_Data_Matricula, MAT_Status) 
                  VALUES (?, ?, ?, ?)`;
  
    db.query(sql, [MAT_Fk_Oficina, MAT_Fk_Aluno, MAT_Data_Matricula, MAT_Status], (error, results) => {
      if (error) {
        console.error("Erro ao criar matrícula:", error.message);
        return res.status(500).json({ error: "Erro ao criar matrícula" });
      }
      res.status(201).json({ MAT_Id: results.insertId });
    });
  };

// Obtém todas as matrículas
export const getMatriculas = (req, res) => {
  const query = `
    SELECT 
      TBL_Matricula_Oficina.MAT_Id,
      TBL_Matricula_Oficina.MAT_Data_Matricula,
      TBL_Matricula_Oficina.MAT_Status,
      TBL_Matricula_Oficina.MAT_Fk_Aluno,
      TBL_Oficina.OFC_Nome
    FROM 
      TBL_Matricula_Oficina
    INNER JOIN 
      TBL_Oficina ON TBL_Matricula_Oficina.MAT_Fk_Oficina = TBL_Oficina.OFC_Id;
  `;

  db.query(query, (error, results) => {
    if (error) {
      console.error("Erro ao obter matrículas:", error);
      return res.status(500).json({ error: "Erro ao obter matrículas" });
    }

    res.status(200).json(results);
  });
};

export const getMatriculasByAluno = (req, res) => {
  const { alunoId } = req.params;

  console.log("Aluno ID recebido:", alunoId);  // Log para verificar se o ID está correto

  const query = `
    SELECT 
      TBL_Matricula_Oficina.MAT_Id,
      TBL_Matricula_Oficina.MAT_Data_Matricula,
      TBL_Matricula_Oficina.MAT_Status,
      TBL_Matricula_Oficina.MAT_Fk_Aluno,
      TBL_Oficina.OFC_Nome
    FROM 
      TBL_Matricula_Oficina
    INNER JOIN 
      TBL_Oficina ON TBL_Matricula_Oficina.MAT_Fk_Oficina = TBL_Oficina.OFC_Id
    WHERE 
      TBL_Matricula_Oficina.MAT_Fk_Aluno = ?;
  `;

  db.query(query, [alunoId], (error, results) => {
    if (error) {
      console.error("Erro ao obter matrículas do aluno:", error);
      return res.status(500).json({ error: "Erro ao obter matrículas do aluno" });
    }

    if (results.length === 0) {
      console.log("Nenhuma matrícula encontrada para o aluno:", alunoId);  // Log de verificação
    } else {
      console.log("Matrículas encontradas para o aluno:", alunoId, results);  // Verifica o que está sendo retornado
    }

    // Retorna a resposta mesmo quando nenhuma matrícula é encontrada
    res.status(200).json({
      message: results.length === 0 ? "Nenhuma matrícula encontrada para o aluno" : "Matrículas encontradas",
      matriculas: results,  // Retorna as matrículas encontradas ou um array vazio
    });
  });
};

export const getMatriculaByAlunoEOficina = (req, res) => {
  const { alunoId, oficinaId } = req.params;
  
  console.log("Aluno ID:", alunoId);  // Log para verificar se o ID está correto
  console.log("Oficina ID:", oficinaId);  // Log para verificar se o ID da oficina está correto

  const query = `
    SELECT 
      MAT_Id,
      MAT_Data_Matricula,
      MAT_Status,
      MAT_Fk_Aluno,
      MAT_Fk_Oficina
    FROM 
      TBL_Matricula_Oficina
    WHERE 
      MAT_Fk_Aluno = ? AND MAT_Fk_Oficina = ?;
  `;

  db.query(query, [alunoId, oficinaId], (error, results) => {
    if (error) {
      console.error("Erro ao obter matrícula:", error);
      return res.status(500).json({ error: "Erro ao obter matrícula" });
    }

    res.status(200).json({
      matriculas: results,  // Retorna as matrículas encontradas ou um array vazio
    });
  });
};


// Atualiza uma matrícula por ID
export const updateMatricula = async (req, res) => {
  try {
    const { id } = req.params;
    const { MAT_Fk_Oficina, MAT_Fk_Aluno, MAT_Data_Matricula, MAT_Status } = req.body;

    const [result] = await db.execute(
      "UPDATE TBL_Matricula_Oficina SET MAT_Fk_Oficina = ?, MAT_Fk_Aluno = ?, MAT_Data_Matricula = ?, MAT_Status = ? WHERE MAT_Id = ?",
      [MAT_Fk_Oficina, MAT_Fk_Aluno, MAT_Data_Matricula, MAT_Status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Matrícula não encontrada" });
    }

    res.status(200).json({ message: "Matrícula atualizada com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar matrícula" });
  }
};

// Exclui uma matrícula por ID
export const deleteMatricula = (req, res) => {
  const { alunoId } = req.params;
  console.log("ID recebido:", alunoId); // Log para verificar se o ID está correto

  const query = "DELETE FROM TBL_Matricula_Oficina WHERE MAT_Fk_Aluno = ?";
  
  db.query(query, [alunoId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao excluir matrícula", details: err });
    }

    console.log("Resultado da exclusão:", result); // Log para verificar o resultado da query

    if (result.affectedRows === 0) {
      console.log("Nenhuma matrícula encontrada para o aluno com ID:", alunoId); // Log de informação
      // Continua o fluxo normal sem impedir a execução do código
    }

    return res.status(200).json({ message: "Matrícula excluída com sucesso ou já não existente" });
  });
};