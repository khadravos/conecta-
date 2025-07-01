import express from 'express';
import enviarEmailTeste from '../controllers/SendEmail.js';

const router = express.Router();

router.post('/recuperar-senha', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email é obrigatório' });
  }

  // Limitação para apenas um e-mail permitido
  if (email !== 'conectamaispi@gmail.com') {
    return res.status(403).json({ error: 'E-mail inválido ou não autorizado para recuperação.' });
  }

  try {
    await enviarEmailTeste(email);
    res.status(200).json({ message: 'E-mail enviado com sucesso!' });
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    res.status(500).json({ error: 'Erro ao enviar o e-mail.' });
  }
});

export default router;
