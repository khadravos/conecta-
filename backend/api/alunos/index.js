import { db } from "../../db.js";

export default function handler(req, res) {
  if (req.method === "GET") {
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
      if (err) return res.status(500).json({ error: "Erro ao buscar alunos", details: err });
      return res.status(200).json(data);
    });
  }

  else if (req.method === "POST") {
    const {
      cpf, nomeCompleto, dataNascimento, serie, turno, deficiencia,
      medicamento, alergia, raca, sexo, ALN_Fk_Responsavel, ALN_Fk_Escola
    } = req.body;

    if (!cpf || !nomeCompleto || !dataNascimento || !ALN_Fk_Responsavel || !ALN_Fk_Escola) {
      return res.status(400).json({ error: "Faltando campos obrigatórios." });
    }

    const query = `
      INSERT INTO TBL_Aluno (
        ALN_CPF, ALN_Nome_Completo, ALN_Data_Nascimento, ALN_Serie, ALN_Turno,
        ALN_Deficiencia, ALN_Medicamento, ALN_Alergia, ALN_Raca, ALN_Sexo,
        ALN_Fk_Responsavel, ALN_Fk_Escola, ALN_ativo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      cpf, nomeCompleto, dataNascimento, serie, turno, deficiencia,
      medicamento, alergia, raca, sexo, ALN_Fk_Responsavel, ALN_Fk_Escola, true
    ];

    db.query(query, values, (err, result) => {
      if (err) return res.status(500).json({ error: "Erro ao adicionar aluno", details: err });
      return res.status(201).json({ message: "Aluno criado com sucesso", alunoId: result.insertId });
    });
  }

  else {
    res.status(405).json({ error: "Método não permitido" });
  }
}
