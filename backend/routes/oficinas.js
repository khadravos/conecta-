import express from "express";
import upload from "../config/multer.js"; // importa o upload já configurado

import {
  getOficina,
  getTodasOficinas,
  addOficina,
  updateOficina,
  deleteOficina,
} from "../controllers/oficinas.js";

const router = express.Router();

router.get("/", getTodasOficinas);
router.get("/:id", getOficina);

// Rota com upload de imagens
router.post(
  "/",
  upload.fields([
    { name: "imagemMain", maxCount: 1 },
    { name: "imagemSec", maxCount: 1 },
  ]),
  addOficina
);

router.put("/:id",
  upload.fields([
    { name: "imagemMain", maxCount: 1 },
    { name: "imagemSec", maxCount: 1 },
  ]), updateOficina);
router.delete("/:id", deleteOficina);

export default router;
