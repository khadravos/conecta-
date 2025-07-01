import express from "express";
import {  addAluno,  deleteAluno,  getAlunoById,  getAlunos,  updateAluno, updateAlunoAtivo,} from "../controllers/aluno.js";
import {  addEscola,  updateEscola,  deleteEscola,  getEscola,} from "../controllers/escola.js";
import {  addResponsavel,  updateResponsavel,  deleteResponsavel,  getResponsavel,} from "../controllers/responsavel.js";
import {  addContato,  updateContato,  deleteContato,  getContato,} from "../controllers/contato.js";
import {  addMatricula,  updateMatricula,  deleteMatricula,  getMatriculas, getMatriculasByAluno, getMatriculaByAlunoEOficina} from "../controllers/matricula.js";

const router = express.Router();

// Rotas para alunos
router.get("/", getAlunos); // Obtém todos os alunos
router.get("/aluno/:id", getAlunoById); // Obtém todos os alunos
router.post("/", addAluno); // Cria um novo aluno
router.put("/:id", updateAluno); // Atualiza um aluno específico por ID
router.delete("/:id", deleteAluno); // Exclui um aluno específico por ID
router.patch("/:id/ativo", updateAlunoAtivo);

// Rotas para escola (associadas ao aluno)
router.get("/", getEscola);
router.post("/escola", addEscola); // Adiciona escola para um aluno
router.put("/:id/escola", updateEscola); // Atualiza escola de um aluno
router.delete("/:alunoId/escola", deleteEscola); // Exclui escola de um aluno

// Rotas para responsável (associadas ao aluno)
router.get("/", getResponsavel);
router.post("/responsavel", addResponsavel); // Adiciona responsável para um aluno
router.put("/:id/responsavel", updateResponsavel); // Atualiza responsável de um aluno
router.delete("/:alunoId/responsavel", deleteResponsavel); // Exclui responsável de um aluno

// Rotas para contatos (associados ao aluno)
router.get("/", getContato);
router.post("/contatos", addContato); // Adiciona contato para um aluno
router.put("/:alunoId/contatos", updateContato); // Atualiza contato de um aluno
router.delete("/:alunoId/contatos", deleteContato); // Exclui contato de um aluno

// Rotas para matrículas (TBL_Matricula_Oficina)
router.get("/matriculas/:alunoId/:oficinaId", getMatriculaByAlunoEOficina);
router.get("/matriculas", getMatriculas); // Obtém todas as matrículas
router.get("/matriculas/:alunoId", getMatriculasByAluno);
router.post("/matriculas", addMatricula); // Adiciona uma nova matrícula
router.put("/matriculas/:id", updateMatricula); // Atualiza uma matrícula por ID
router.delete("/matriculas/:alunoId", deleteMatricula); // Exclui uma matrícula por ID

export default router;