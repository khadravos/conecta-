import { db } from "../db.js";


export const getOficinasVinculadas = (req, res) => {
    const query = `
SELECT 
  p.PRO_Id,
  p.PRO_Nome,
  p.PRO_Email,
  p.PRO_Celular,
  p.PRO_CPF,
  o.OFC_Nome,
  o.OFC_Fk_Professor
FROM 
  TBL_Professor_Voluntario p
LEFT JOIN 
  TBL_Oficina o ON o.OFC_Fk_Professor = p.PRO_Id;
  `;
  
  
    console.log("Executando query:", query);  // Log para verificar a query
  
    db.query(query, (error, results) => {
      if (error) {
        console.error("Erro ao obter oficinas vinculadas:", error);  // Mais detalhes sobre o erro
        return res.status(500).json({ error: "Erro ao obter oficinas vinculadas" });
      }
  
      console.log("Resultados da query:", results);  // Verifique se os resultados estão vindo corretamente
      res.status(200).json(results);
    });
  };


export const getOficinasByProfessor = (req, res) => {
  const { professorId } = req.params; // Recebe o ID do professor

  console.log("Professor ID recebido:", professorId); // Log para depuração

  const query = `
    SELECT 
      OFC_Id,
      OFC_Nome,
      OFC_Fk_Professor
    FROM 
      TBL_Oficina
    WHERE 
      OFC_Fk_Professor = ?; 
  `;

  db.query(query, [professorId], (error, results) => {
    if (error) {
      console.error("Erro ao obter oficinas do professor:", error);
      return res.status(500).json({ error: "Erro ao obter oficinas do professor" });
    }

    // Verifica se o professor tem oficinas vinculadas
    if (results.length === 0) {
      console.log("Nenhuma oficina encontrada para o professor:", professorId);
      return res.status(404).json({ message: "Nenhuma oficina encontrada para este professor" });
    } else {
      console.log("Oficinas encontradas para o professor:", professorId, results);
    }

    res.status(200).json({
      message: "Oficinas encontradas",
      oficinas: results,
    });
  });
};
