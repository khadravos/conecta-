import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Card, InputGroup, Modal } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { Link, Navigate } from "react-router-dom"; 
import { FaSlidersH, FaSearch, FaPlus, FaDownload, FaCalendarAlt, FaIdCard, FaUser, FaRegLightbulb, FaFilePdf, FaTimes, FaToggleOn, FaToggleOff, FaPuzzlePiece } from "react-icons/fa";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';
import Axios from "axios";

function Matriculas() {
  const [alunos, setAlunos] = useState([]); // Estado para armazenar os alunos
  const [Matricula, setmatricula] = useState([]); // Estado para armazenar os alunos
  const [searchTerm, setSearchTerm] = useState(""); // Estado para armazenar a pesquisa
  const [currentPage, setCurrentPage] = useState(1); // Estado para a página atual
  const itemsPerPage = 20; // Quantidade de itens por página
  const [confirmado, setConfirmado] = useState(false);
  const [showModal, setShowModal] = useState(false); // Controle do modal
  const [showfiltro, setShowfiltro] = useState(false); // Controle do modal
  const [todosSelecionado, setTodosSelecionado] = useState(false);
  const [statusSelecionado, setStatusSelecionado] = useState("");
  const [oficinaSelecionada, setOficinaSelecionada] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("");


  // Função para buscar os alunos
  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        const response = await Axios.get("http://localhost:8800"); // Substitua pela URL correta da API
        setAlunos(response.data); // Armazenar os dados dos alunos no estado
      } catch (error) {
        console.error("Erro ao buscar alunos:", error);
      }
    };

    fetchAlunos();
  }, []); // O array vazio faz com que a função seja chamada apenas uma vez ao carregar o componente

  useEffect(() => {
    const fetchMatriculas = async () => {
      try {
        const response = await Axios.get("http://localhost:8800/matriculas"); // Substitua pela URL correta da API
        setmatricula(response.data); // Armazenar os dados dos alunos no estado
      } catch (error) {
        console.error("Erro ao buscar matriculas:", error);
      }
    };

    fetchMatriculas();
  }, []);

  // Filtrando os alunos com base no termo de pesquisa
  const filteredAlunos = alunos.filter((aluno) => {
  const alunoNome = aluno.ALN_Nome_Completo.toLowerCase();
  const searchLower = searchTerm.toLowerCase();
  const nomeMatch = alunoNome.includes(searchLower);
  const alunoMatriculas = Matricula.filter((mat) => mat.MAT_Fk_Aluno === aluno.ALN_Id);
  const alunoAtivo = aluno.ALN_ativo;

  const oficinaMatch = (mat) =>
    oficinaSelecionada ? mat.OFC_Nome === oficinaSelecionada : true;

  const nomeOficinaMatch = (mat) =>
    mat.OFC_Nome.toLowerCase().includes(searchLower);

  const statusMatch = () =>
    statusFiltro ? (alunoAtivo ? "Ativo" : "Inativo") === statusFiltro : true;

  // Se for busca por nome ou por nome da oficina
  if (searchTerm.trim()) {
    return (
      nomeMatch ||
      alunoMatriculas.some(
        (mat) => oficinaMatch(mat) && statusMatch() && nomeOficinaMatch(mat)
      )
    );
  }

  // Se o aluno for inativo, só mostra se não tiver oficina selecionada e status for "Inativo" ou vazio
  if (!alunoAtivo) {
    return !oficinaSelecionada && (!statusFiltro || statusFiltro === "Inativo");
  }

  // Se for ativo, confere se alguma matrícula bate com os filtros
  return alunoMatriculas.some(
    (mat) => oficinaMatch(mat) && statusMatch()
  );
});




  const handleSearchChange = (e) => {
    // Atualiza o termo de busca
    setSearchTerm(e.target.value);
    
    // Volta para a primeira página (ou decrementa a página atual)
    setCurrentPage(1); // Ou `currentPage - 1`, dependendo da lógica desejada
  };
  const [isAuthenticated, setIsAuthenticated] = useState(true); 

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthenticated(false); 
    }
  }, []);


  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }


  // Determinar os índices dos itens na página atual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAlunos.slice(indexOfFirstItem, indexOfLastItem);

  // Determinar o número total de páginas
  const totalPages = Math.ceil(filteredAlunos.length / itemsPerPage);

  // Funções de navegação da página
  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  
  const formatCPF = (cpf) => {
      return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString); // Converte a string para um objeto Date
    
    const year = date.getFullYear(); // Obtém o ano
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Obtém o mês (0-11, então somamos 1) e garante dois dígitos
    const day = String(date.getDate()).padStart(2, '0'); // Obtém o dia e garante dois dígitos
    
    return `${day}/${month}/${year}`; // Formata a data no formato 9999/99/99
  };
  
  const gerarPDF = () => {
  const doc = new jsPDF();
  const titulo = "Relatório de Alunos";
  doc.setFontSize(18);
  doc.text(titulo, 105, 15, { align: 'center' });

  // Colunas da tabela, removendo CPF
  const colunas = ["Nome", "Nascimento", "Oficina", "Status"];

  // Linhas da tabela
  const linhas = [];

  // Ordena alunos por nome (alfabético)
  const alunosOrdenados = [...alunos].sort((a, b) =>
    a.ALN_Nome_Completo.localeCompare(b.ALN_Nome_Completo)
  );

  alunosOrdenados.forEach((aluno) => {
    const alunoMatriculas = Matricula.filter(
      (mat) => mat.MAT_Fk_Aluno === aluno.ALN_Id
    );

    // Filtra matrículas do aluno com base na oficina selecionada
    const matriculasFiltradas = alunoMatriculas.filter((mat) =>
      oficinaSelecionada ? mat.OFC_Nome === oficinaSelecionada : true
    );

    // Determina status do aluno para o relatório
    const statusAluno = aluno.ALN_ativo ? "Ativo" : "Inativo";

    if (matriculasFiltradas.length === 0) {
      // Sem matrículas, mas pode aparecer se status bater com filtro
      if (todosSelecionado || statusSelecionado === statusAluno || statusSelecionado === "") {
        linhas.push([
          aluno.ALN_Nome_Completo,
          formatDate(aluno.ALN_Data_Nascimento),
          "—",
          statusAluno
        ]);
      }
    } else {
      // Com matrículas filtradas
      matriculasFiltradas.forEach((mat) => {
        // Para alunos inativos, mostra sempre como "Inativo" no status da linha, ignorando MAT_Status
        const statusLinha = aluno.ALN_ativo ? mat.MAT_Status : "Inativo";

        // Filtra por status selecionado (considerando statusAluno para alunos sem matrícula, statusLinha para os que têm)
        const statusOk = statusSelecionado
          ? (aluno.ALN_ativo ? statusLinha === statusSelecionado : statusAluno === statusSelecionado)
          : true;

        if (todosSelecionado || statusOk) {
          linhas.push([
            aluno.ALN_Nome_Completo,
            formatDate(aluno.ALN_Data_Nascimento),
            mat.OFC_Nome,
            statusLinha
          ]);
        }
      });
    }
  });

  if (linhas.length === 0) {
    alert('Nenhum aluno encontrado com os critérios selecionados.');
    return;
  }

  autoTable(doc, {
    head: [colunas],
    body: linhas,
    startY: 25,
  });

  doc.save('relatorio_alunos.pdf');
};


const toggleAtivo = async (alunoId, novoStatus) => {
  try {
    await Axios.patch(`http://localhost:8800/${alunoId}/ativo`, {
      ativo: novoStatus
    });

    setAlunos(prev =>
      prev.map(aluno =>
        aluno.ALN_Id === alunoId ? { ...aluno, ALN_ativo: novoStatus } : aluno
      )
    );
  } catch (error) {
    console.error("Erro ao atualizar status do aluno:", error);
    alert("Erro ao alterar status do aluno.");
  }
};

  return (
    <main className="container shadow p-4">

      {/* Cabeçalho vermelho */}
      <Container
        fluid
        className="d-flex align-items-center justify-content-center py-0"
        style={{ backgroundColor: '#ad0b0b', color: 'white', height: '15vh' }}
      >
        <h2
          style={{
            fontFamily: 'Antonio, sans-serif',
            fontSize: '3rem',
            fontWeight: '700',
            color: 'yellow',
          }}
        >
          Gerenciador de Matrículas
        </h2>
      </Container>

      <Container>
        <Row className="justify-content-center mb-3">
          <Col className="col-md-6">
            <InputGroup>
              <InputGroup.Text>
                <FaSearch style={{ color: "#ad0b0b" }} />
              </InputGroup.Text>

              <Form.Control
                size="lg"
                type="text"
                placeholder="Insira algum dado do aluno"
                value={searchTerm}
                onChange={handleSearchChange}  // Atualizando o termo de pesquisa
              />

              <InputGroup.Text>
                <Button
                  title="Filtrar"
                  style={{ backgroundColor: "#ad0b0b", border: "none" }}
                  onClick={() => setShowfiltro(true)}
                >
                  <FaSlidersH />
                </Button>
              </InputGroup.Text>
            </InputGroup>
          
          </Col>
          <Col className="col-md-2">
            <Link to="/criarMatricula" title="Nova Matrícula">
              <Button size="lg" style={{ backgroundColor: "#ad0b0b", border: "none" }}>
                <FaPlus size={22}/>
              </Button>
            </Link>
          </Col>
        </Row>

        <Modal show={showfiltro} onHide={() => setShowfiltro(false)} centered>
          <Modal.Header closeButton style={{ backgroundColor: '#f9a825' }}>
            <Modal.Title style={{ fontWeight: 'bold', color: 'black' }}>
              Filtros de Pesquisa
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Status:</Form.Label>
                <Form.Select
                  value={{statusFiltro}}
                  onChange={(e) => setStatusFiltro(e.target.value)}
                >
                  <option value="">Todos</option>
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Oficina:</Form.Label>
                <Form.Select
                  value={oficinaSelecionada}
                  onChange={(e) => setOficinaSelecionada(e.target.value)}
                >
                  <option value="">Todas</option>
                  {[...new Set(Matricula.map(m => m.OFC_Nome))].map((oficina, idx) => (
                    <option key={idx} value={oficina}>{oficina}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                  setStatusFiltro("");
                  setOficinaSelecionada("");
                }}
            >
              Limpar
            </Button>

            <Button
              style={{ backgroundColor: "#f9a825", border: "none", color: "black", fontWeight: "bold" }}
              onClick={() => setShowfiltro(false)}
            >
              Aplicar Filtros
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>

        <Container className="align-items-center justify-content-center py-0">
          <Row sm={1} md={2} lg={2} xl={3} xxl={4} className="justify-content-between">
            {currentItems.map((aluno) => {
              // Filtrar matrículas do aluno atual
              const matriculasDoAluno = Matricula.filter(
                (matricula) => matricula.MAT_Fk_Aluno === aluno.ALN_Id
              );

              return (
                <Col key={aluno.ALN_Id}>
                  <Link
                    to={`/editarMatricula/${aluno.ALN_Id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Card
                      className="shadow"
                      style={{
                        minWidth: "18rem",
                        maxWidth: "19rem",
                        backgroundColor: "#21212212",
                        borderRadius: "20px",
                      }}
                    >
                      <Row>
                        {/* Ícone de Toggle com funcionalidade de ativar/inativar */}
                        <Col className="col-md-4 d-flex align-items-center justify-content-center">
                          <div
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleAtivo(aluno.ALN_Id, !aluno.ALN_ativo);
                            }}
                            title={aluno.ALN_ativo ? "Inativar aluno" : "Ativar aluno"}
                            style={{ cursor: "pointer" }}
                          >
                            {aluno.ALN_ativo ? (
                              <FaToggleOn size={30} style={{ color: "#28a745" }} />
                            ) : (
                              <FaToggleOn
                                size={30}
                                style={{ color: "#dc3545", transform: "rotate(180deg)" }}
                              />
                            )}
                          </div>
                        </Col>

                        {/* Dados do Aluno */}
                        <Col className="col-md-8">
                          <Card.Text
                            className="m-1 text-start"
                            style={{ fontFamily: "'Anton', sans-serif" }}
                          >
                            <FaIdCard className="me-2" />
                            {formatCPF(aluno.ALN_CPF)}
                          </Card.Text>

                          <Card.Text
                            className="m-1 text-start"
                            style={{ fontFamily: "'Anton', sans-serif" }}
                          >
                            <FaCalendarAlt className="me-2" />
                            {formatDate(aluno.ALN_Data_Nascimento)}
                          </Card.Text>
                        </Col>

                        {/* Oficinas ou Sem matrícula */}
                        <Col xs={12}>
                          {matriculasDoAluno.length > 0 ? (
                            <div className="m-0 p-1 d-flex align-items-center justify-content-center" style={{ minHeight: "5rem" }}>
                              <Card.Text className="m-0 p-0" style={{ fontFamily: "'Archivo Black', sans-serif" }}>
                                <FaPuzzlePiece className="me-2" size={20} /> {matriculasDoAluno.map((mat) => mat.OFC_Nome).join(", ")}
                              </Card.Text>
                            </div>
                          ) : (
                            <div className="m-0 p-1 d-flex align-items-center justify-content-center" style={{ minHeight: "5rem" }}>
                              <Card.Text className="m-2 p-0" style={{ fontFamily: "'Archivo Black', sans-serif" }}>
                                <FaRegLightbulb className="me-2" /> Sem matrículas cadastradas
                              </Card.Text>
                            </div>
                          )}
                        </Col>
                      </Row>

                      {/* Nome do Aluno no rodapé */}
                      <Container
                        className="py-0 d-flex align-items-center justify-content-center"
                        style={{
                          backgroundColor: "#ad0b0b",
                          color: "white",
                          borderRadius: "0px 0px 20px 20px",
                          minHeight: "5rem",
                        }}
                      >
                        <Card.Title style={{ fontFamily: "'Archivo Black', sans-serif" }}>
                          <FaUser className="me-2" />
                          {aluno.ALN_Nome_Completo}
                        </Card.Title>
                      </Container>
                    </Card>
                  </Link>
                </Col>

              );
            })}
          </Row>

          {/* Controles de Paginação */}
          <Row className="justify-content-center mt-3">
            <Col className="col-auto">
              <Button
                variant="dark"
                style={{ backgroundColor: "#ad0b0b" }}
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                Página Anterior
              </Button>
            </Col>
            <Col className="col-auto">
              <span>
                Página {currentPage} de {totalPages}
              </span>
            </Col>
            <Col className="col-auto">
              <Button
                variant="dark"
                style={{ backgroundColor: "#ad0b0b" }}
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Próxima Página
              </Button>
            </Col>
          </Row>
        </Container>
      

      {/* Botão flutuante com ícone */}
      <Link className="fab-button2" title="Baixar PDF" onClick={() => setShowModal(true)}>
        <FaDownload size={25} />
      </Link>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: '#f9a825' }}>
          <div className="w-100 text-center">
            <Modal.Title
              style={{
                fontFamily: 'Antonio, sans-serif',
                fontSize: '2rem',
                fontWeight: '700',
                color: 'black',
              }}
            >
              Relatório PDF de Alunos
            </Modal.Title>
          </div>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Check 
              type="checkbox"
              label="Incluir todos os alunos"
              checked={todosSelecionado}
              onChange={(e) => setTodosSelecionado(e.target.checked)}
            />

            <Form.Group className="mt-3">
              <Form.Label>Status do Aluno:</Form.Label>
              <Form.Select
                disabled={todosSelecionado}
                value={statusSelecionado}
                onChange={(e) => setStatusSelecionado(e.target.value)}
              >
                <option value="">Selecione</option>
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Oficina:</Form.Label>
              <Form.Select
                disabled={todosSelecionado}
                value={oficinaSelecionada}
                onChange={(e) => setOficinaSelecionada(e.target.value)}
              >
                <option value="">Selecione</option>
                {Array.from(new Set(Matricula.map((mat) => mat.OFC_Nome))).map((oficina, index) => (
                  <option key={index} value={oficina}>
                    {oficina}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Checkbox de confirmação de dados sensíveis */}
            <Form.Check
              className="mt-4"
              type="checkbox"
              label="Confirmo que compreendo que este relatório contém dados sensíveis dos alunos"
              checked={confirmado}
              onChange={(e) => setConfirmado(e.target.checked)}
              style={{ fontFamily: 'Antonio, sans-serif', fontWeight: '500', fontSize: '1rem' }}
            />
          </Form>
            </Modal.Body>

            <Modal.Footer>
              <Button
                style={{
                  color: "black",
                  fontWeight: "bold",
                  backgroundColor: "#e0e0e0",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
                onClick={() => setShowModal(false)}
              >
                <FaTimes />
                Cancelar
              </Button>

              <Button
                style={{
                  backgroundColor: "#f9a825",
                  border: "none",
                  color: "black",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
                onClick={gerarPDF}
                disabled={!confirmado}
              >
                <FaFilePdf />
                Gerar PDF
              </Button>
            </Modal.Footer>
          </Modal>



    </main>
  );
}

export default Matriculas;
