import { db } from "../db.js";

// Função para buscar todos os eventos
export const getEventos = (req, res) => {
  db.query('SELECT * FROM eventos ORDER BY data_evento ASC', (err, results) => {
    if (err) {
      console.error('Erro ao buscar eventos:', err);
      return res.status(500).json({ erro: 'Erro ao buscar eventos' });
    }
    res.json(results);
  });
};

// Função para adicionar um novo evento
export const addEvento = (req, res) => {
  const { data_evento, tipo_evento } = req.body;

  if (!data_evento || !tipo_evento) {
    return res.status(400).json({ erro: 'Dados incompletos' });
  }

  const sql = 'INSERT INTO eventos (data_evento, tipo_evento) VALUES (?, ?)';
  db.query(sql, [data_evento, tipo_evento], (err, result) => {
    if (err) {
      console.error('Erro ao inserir evento:', err);
      return res.status(500).json({ erro: 'Erro ao inserir evento' });
    }

    res.status(201).json({
      id: result.insertId,
      data_evento,
      tipo_evento
    });
  });
};

// FUNÇÃO PARA EXCLUIR UM EVENTO
export const deleteEvento = (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM eventos WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Erro ao excluir evento:', err);
      return res.status(500).json({ erro: 'Erro ao excluir evento' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Evento não encontrado' });
    }

    res.status(204).send(); // sucesso sem conteúdo
  });
};
