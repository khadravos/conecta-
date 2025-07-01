// logins.js
import express from "express";
import { loginUsuario } from "../controllers/login.js"; 

const router = express.Router();

// Define a rota POST para login
router.post("/", loginUsuario); // A URL /login vai aceitar POST

export default router;