import express from 'express';
import { getEventos, addEvento, deleteEvento } from '../controllers/eventos.js';

const router = express.Router();

// Rota para obter todos os eventos
router.get("/", getEventos);

// Rota para adicionar um novo evento
router.post("/", addEvento);

// ROTA DE EXCLUSÃO
router.delete("/:id", deleteEvento);

export default router;