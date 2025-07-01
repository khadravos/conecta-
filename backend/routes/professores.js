import express from "express";
import { getProfessores, getProfessorByNome, createProfessor, getProfessorById, updateProfessor, getHorariosDoProfessor } from "../controllers/professor.js";
import { getOficinasByProfessor, getOficinasVinculadas } from "../controllers/oficinasVinculadas.js";

const router = express.Router();

// Rota para obter todos os professores
router.get("/", getProfessores);

// Rota para buscar professor por nome
router.get("/buscar", getProfessorByNome);

// Rota para obter oficinas vinculadas ao professor
router.get("/oficinasVinculadas/:professorId", getOficinasByProfessor);

// Rota para obter oficinas
router.get("/oficinasVinculadas", getOficinasVinculadas);

router.get("/:id/horarios", getHorariosDoProfessor);

// Rota para cadastrar novo professor
router.post("/", createProfessor);

// Rota para obter um professor específico pelo ID
router.get("/:id", getProfessorById);  // Obtém o professor pelo ID

router.put("/:id", updateProfessor);

export default router;


