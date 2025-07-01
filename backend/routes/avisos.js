import express from "express";
import {
  getTodosAvisos,
  getAviso,
  addAviso,
  updateAviso,
  deleteAviso,
} from "../controllers/aviso.js";

const router = express.Router();

router.get("/", getTodosAvisos);
router.get("/:id", getAviso);
router.post("/", addAviso);
router.put("/:id", updateAviso);
router.delete("/:id", deleteAviso);

export default router;
