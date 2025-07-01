import mysql from "mysql2";
import fs from "fs";
import path from "path";
// Caminho para o certificado SSL (opcional se fornecido)
const sslOptions = {
    ca: fs.readFileSync(path.resolve("certs/ca.pem")),
    rejectUnauthorized: true, // ative isso se quiser validar certificado
};

export const db = mysql.createConnection({
  host: "conecta-messiaslucio28-2dbb.i.aivencloud.com",
  port: 27923,
  user: "avnadmin",
  password: "AVNS_Pc91gUOvb8ow82_dykB",
  database: "defaultdb",
  ssl: sslOptions, // Ativa SSL (mesmo sem certificado, necessário para Aiven)
});