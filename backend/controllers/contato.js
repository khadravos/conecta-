import { db } from "../db.js";

export const getContato = (req, res) => {
  const alunoId = parseInt(req.params.alunoId, 10);

  if (isNaN(alunoId)) {
    return res.status(400).json({ error: "ID de aluno inválido." });
  }

  const query = `
    SELECT CONT_Id, CONT_Tipo, CONT_Numero, CONT_dono
    FROM TBL_Contato
    WHERE CONT_Fk_Aluno = ?
  `;

  db.query(query, [alunoId], (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao buscar contatos", details: err });
    }
    return res.status(200).json(data);
  });
};
// Adicionar contato
export const addContato = (req, res) => {
  // Log para depuração
  console.log("Dados recebidos:", req.body);

  const { alunoId, contatos } = req.body;

  // Validações iniciais
  if (!alunoId) {
    return res.status(400).json({ error: "Faltando alunoId." });
  }
  if (!Array.isArray(contatos)) {
    return res.status(400).json({ error: "Não é um array." });
  }
  if (contatos.length === 0) {
    return res.status(400).json({ error: "Tamanho 0." });
  }

  // Mapear os contatos para o formato necessário para o banco de dados
  const valoresContatos = contatos.map(contato => ({
    tipo: contato.tipo,
    numero: contato.numero,  // Remover máscara do número, se necessário
    alunoId,
    dono: contato.dono
  }));

  // Verificar duplicações antes de fazer a inserção
  const checkQuery = `
    SELECT CONT_Numero, CONT_Tipo 
    FROM TBL_Contato 
    WHERE CONT_Fk_Aluno = ? 
    AND (CONT_Numero, CONT_Tipo) IN (?)
  `;

  // Extrair os números e tipos dos contatos que serão verificados
  const valoresParaVerificacao = valoresContatos.map(c => [c.numero, c.tipo]);

  db.query(checkQuery, [alunoId, valoresParaVerificacao], (err, result) => {
    if (err) {
      console.error("Erro ao verificar duplicações:", err);
      return res.status(500).json({ error: "Erro ao verificar duplicações", details: err });
    }

    // Se algum contato já existir, retornamos um erro
    const contatosExistentes = result.map(row => `${row.CONT_Numero}-${row.CONT_Tipo}`);
    const contatosUnicos = valoresContatos.filter(contato => {
      const contatoId = `${contato.numero}-${contato.tipo}`;
      return !contatosExistentes.includes(contatoId);  // Filtra contatos que já existem
    });

    // Se todos os contatos são duplicados, não há nada a adicionar
    if (contatosUnicos.length === 0) {
      return res.status(400).json({ error: "Todos os contatos já existem." });
    }

    // Inserir os contatos únicos
    const insertQuery = `
      INSERT INTO TBL_Contato(
        CONT_Tipo, CONT_Numero, CONT_Fk_Aluno, CONT_dono
      ) VALUES ?
    `;

    const valoresInsercao = contatosUnicos.map(contato => [
      contato.tipo,
      contato.numero,
      alunoId,
      contato.dono
    ]);

    db.query(insertQuery, [valoresInsercao], (err) => {
      if (err) {
        console.error("Erro ao inserir contatos:", err);
        return res.status(500).json({ error: "Erro ao adicionar contatos", details: err });
      }

      console.log("Contatos adicionados com sucesso!");
      return res.status(201).json({ message: "Contatos adicionados com sucesso." });
    });
  });
};

// Função para remover máscara de números de telefone
function removeMask(value) {
  return value.replace(/\D/g, '');  // Remove qualquer caractere não numérico
}

// Atualizar contato de um aluno
export const updateContato = (req, res) => {
  const alunoId = parseInt(req.params.alunoId, 10);
  const { contatos } = req.body;

  if (isNaN(alunoId)) {
    return res.status(400).json({ error: "ID de aluno inválido." });
  }

  // Atualiza os contatos fornecidos
  contatos.forEach((contato) => {
    const queryUpdateContato = `
      UPDATE TBL_Contato 
      SET CONT_Tipo = ?, CONT_Numero = ?
      WHERE CONT_Id = ? AND CONT_Fk_Aluno = ?
    `;

    db.query(queryUpdateContato, [contato.tipo, contato.numero, contato.id, alunoId], (err) => {
      if (err) {
        return res.status(500).json({ error: "Erro ao atualizar contato", details: err });
      }
    });
  });

  return res.status(200).json({ message: "Contatos atualizados com sucesso." });
};

// Deletar contato de um aluno
export const deleteContato = (req, res) => {
  const alunoId = parseInt(req.params.alunoId, 10);

  if (isNaN(alunoId)) {
    return res.status(400).json({ error: "ID de aluno inválido." });
  }

  // Consulta SQL para deletar todos os contatos associados ao aluno
  const queryDeleteContatos = `
    DELETE FROM TBL_Contato 
    WHERE CONT_Fk_Aluno = ?
  `;

  db.query(queryDeleteContatos, [alunoId], (err) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao excluir contatos", details: err });
    }
    return res.status(200).json({ message: "Todos os contatos do aluno foram excluídos com sucesso." });
  });
};

