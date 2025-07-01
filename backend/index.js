import express from "express";
import loginRoutes from "./routes/logins.js"; // Importa as rotas de login
import alunosRoutes from "./routes/alunos.js"; // Importa as rotas de alunos
import professoresRoutes from "./routes/professores.js"; // profs
import oficinasRoutes from "./routes/oficinas.js";
import eventosRoutes from "./routes/eventos.js"; // Importa as rotas de eventos
import noticiasRoutes from "./routes/noticias.js";
import avisosRoutes from "./routes/avisos.js";
import emailRoutes from "./routes/email.js";
import tokenRoutes from "./routes/token.js"; 




// ...


import cors from "cors";

const app = express();

// Middleware para permitir o envio de dados JSON
app.use(express.json());
app.use(cors()); // Para evitar conflito de porta
app.use('/uploads', express.static('public/uploads'));

// Definindo as rotas
app.use("/login", loginRoutes); // Rota de login acessada com POST em "/login"
app.use("/", alunosRoutes); // Rota de alunos acessada com GET em "/alunos"
app.use("/professores", professoresRoutes);
app.use("/oficinas", oficinasRoutes);
app.use("/eventos", eventosRoutes);   
app.use('/noticias', noticiasRoutes);
app.use("/avisos", avisosRoutes);    
app.use("/email", emailRoutes); // Agora você acessa via POST /email/recuperar-senha
app.use("/token", tokenRoutes);



// Inicia o servidor
app.listen(8800, () => {
  console.log("Servidor rodando na porta 8800");
});
