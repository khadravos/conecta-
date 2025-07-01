import express from "express";
import {
  addNoticia,
  getNoticia,
  updateNoticia,
  deleteNoticia,
  getTodasNoticias,
  getNoticiasFavoritas,
  updateFavoritoNoticia
} from "../controllers/noticias.js";

import upload from "../config/multer.js"; // importa o multer

const router = express.Router();

router.get("/", getTodasNoticias);
router.get("/:id", getNoticia);
router.post("/", upload.single("imagem"), addNoticia);
router.put("/:id", upload.single("imagem"), updateNoticia);
router.delete("/:id", deleteNoticia);
router.patch("/noticias/favorito/:id", updateFavoritoNoticia);
router.get("/noticias/favorito", getNoticiasFavoritas);

export default router;