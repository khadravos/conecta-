import express from "express";
import { db } from "../db.js";
import bcrypt from "bcryptjs";



const router = express.Router();

router.post("/verificar-token", (req, res) => {
  const { email, token } = req.body;

  const query = "SELECT ADM_Token FROM TBL_Administrador WHERE ADM_Email = ?";
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro no servidor." });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Email não encontrado." });
    }

    const tokenHash = results[0].ADM_Token;

    // Compara o token enviado (texto) com o hash salvo
    bcrypt.compare(token, tokenHash, (err, isMatch) => {
      if (err) {
        console.error("Erro ao comparar token:", err);
        return res.status(500).json({ error: "Erro ao verificar token." });
      }

      if (isMatch) {
        return res.status(200).json({ success: true });
      } else {
        return res.status(401).json({ error: "Token inválido." });
      }
    });
  });
});




router.post("/redefinir", (req, res) => {
  const { email, novaSenha } = req.body;

if (!novaSenha || novaSenha.length < 8 || !/[A-Z]/.test(novaSenha) || !/\d/.test(novaSenha) ) {
  return res.status(400).json({
    error: "Senha inválida. Deve conter no mínimo 8 caracteres, uma letra maiúscula e um número."
  });
}

  const hash = bcrypt.hashSync(novaSenha, 10);

  const query = "UPDATE TBL_Administrador SET ADM_Senha = ? WHERE ADM_Email = ?";
  db.query(query, [hash, email], (err, result) => {
    if (err) {
      console.error("Erro MySQL ao redefinir senha:", err.sqlMessage || err.message);
      console.error(err);
      return res.status(500).json({ error: "Erro ao atualizar senha 12." });
    }

    res.status(200).json({ message: "Senha atualizada com sucesso." });
  });
});


export default router;
