import nodemailer from 'nodemailer';
import { db } from '../db.js';
import bcrypt from 'bcryptjs'; // ⬅️ importa o bcrypt


function enviarEmailTeste(destinatario) {
  return new Promise((resolve, reject) => {
    if (destinatario !== 'conectamaispi@gmail.com') {
      return reject(new Error('Email não autorizado'));
    }

    // Gera o token simples (6 dígitos)
    const token = Math.floor(100000 + Math.random() * 900000).toString();

    // Criptografa o token
    const tokenHash = bcrypt.hashSync(token, 10);

    // Atualiza o token criptografado no banco
    const sql = 'UPDATE TBL_Administrador SET ADM_Token = ? WHERE ADM_Email = ?';
    db.query(sql, [tokenHash, destinatario], (err, result) => {
      if (err) {
        console.error('Erro ao atualizar o token no banco:', err);
        return reject(err);
      }

      if (result.affectedRows === 0) {
        return reject(new Error('Email não encontrado no banco de dados.'));
      }

      // Agora envia o e-mail com o token em texto simples
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'conectamaispi@gmail.com',
          pass: 'pmeh kvms hjyt aoxg', // senha de app
        },
      });

      const mailOptions = {
  from: 'conectamaispi@gmail.com',
  to: destinatario,
  subject: 'Recuperação de senha - GAAJ - Conecta+',
html: `
  <div style="max-width: 600px; margin: auto; padding: 20px; font-family: Arial, sans-serif; background-color: #f9f9f9; border-radius: 8px; border: 1px solid #ddd;">
    <div style="text-align: center;">
      <img src="http://gaajsp.org.br/image/LOGO-GAAJ.png" alt="Logo GAAJ" style="width: 150px; margin-bottom: 20px;" />
      <h2 style="color: #333;">Recuperação de Senha</h2>
    </div>
    <p style="font-size: 16px; color: #555; text-align: center;">Use o código abaixo para redefinir sua senha:</p>
    <div style="text-align: center; margin: 30px 0;">
      <span style="display: inline-block; font-size: 32px; font-weight: bold; color: #fff; background-color: #007bff; padding: 10px 20px; border-radius: 8px; letter-spacing: 4px;">
        ${token}
      </span>
    </div>
    <p style="font-size: 14px; color: #999; text-align: center;">Se você não solicitou essa recuperação, apenas ignore este e-mail.</p>
  </div>
`,
};

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Erro ao enviar o email:', error);
          return reject(error);
        } else {
          console.log('Email enviado:', info.response);
          return resolve(info);
        }
      });
    });
  });
}

export default enviarEmailTeste;
