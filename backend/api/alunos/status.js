import { db } from "../../db.js";

export default function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { id, ativo } = req.body;
  if (!id || typeof ativo !== "boolean") {
    return res.status(400).json({ error: "Dados inválidos" });
  }

  db.query("UPDATE TBL_Aluno SET ALN_ativo = ? WHERE ALN_Id = ?", [ativo, id], (err) => {
    if (err) return res.status(500).json({ error: "Erro ao atualizar status", details: err });
    return res.status(200).json({ message: "Status atualizado com sucesso" });
  });
}
