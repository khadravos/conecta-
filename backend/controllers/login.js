import { db } from "../db.js";
import bcrypt from "bcrypt"; 
export const loginUsuario = (req, res) => {
  const { email, senha } = req.body; // Usando nome e senha do corpo da requisição

  // Verifica se o usuário existe no banco
  const query = "SELECT * FROM TBL_Administrador WHERE ADM_Email = ?";

  db.query(query, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Erro no servidor", details: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Email ou senha incorretos" });
    }

    const usuario = results[0];

        // Comparação direta sem hash
        bcrypt.compare(senha, usuario.ADM_Senha, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ error: "Erro ao verificar a senha" });
      }

      if (!isMatch) {
        return res.status(401).json({ error: "Email ou senha incorretos" });
      }

      res.status(200).json({ 
        message: "Bem vindo", 
        userId: usuario.ADM_Id, 
        email: usuario.ADM_Email
      });
    });
  });
};