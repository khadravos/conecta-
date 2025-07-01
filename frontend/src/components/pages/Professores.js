import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col } from 'react-bootstrap';
import { Link, Navigate } from "react-router-dom"; 
import Axios from 'axios';
import { FaEnvelope, FaPhone, FaIdCard, FaChalkboardTeacher, FaPlus } from "react-icons/fa";

function Professores() {
  const [professores, setProfessores] = useState([]);
  const [oficinas, setOficinas] = useState([]);

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const response = await Axios.get("http://localhost:8800/professores/oficinasVinculadas");
        const dados = response.data;

        const profsUnicos = [];
        const profIds = new Set();

        dados.forEach(item => {
          if (!profIds.has(item.PRO_Id)) {
            profsUnicos.push({
              PRO_Id: item.PRO_Id,
              PRO_Nome: item.PRO_Nome,
              PRO_Email: item.PRO_Email,
              PRO_Celular: item.PRO_Celular,
              PRO_CPF: item.PRO_CPF
            });
            profIds.add(item.PRO_Id);
          }
        });

        setProfessores(profsUnicos);
        setOficinas(dados);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchDados();
  }, []);

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
          Professores
        </h2>
      </Container>

      {/* Área branca com cards */} 
      <Container className="py-4">
        <Row className="justify-content-center">
          {professores.map((professor) => {
            const oficinasDoProfessor = oficinas
              .filter(oficina => String(oficina.OFC_Fk_Professor) === String(professor.PRO_Id))
              .map(oficina => oficina.OFC_Nome);

            return (
              <Col xs={12} md={6} key={professor.PRO_Id}>
                {/* Torna o card clicável e direciona para a tela de edição */}
                <Link to={`/editarProfessor/${professor.PRO_Id}`} style={{ textDecoration: 'none' }}>
                  <Card style={{ border: '2px solid #ad0b0b'}} className="mb-4 shadow rounded-4 text-center">
                    <Card.Body className="p-4">
                      <Card.Title className="fs-3 fw-bold mb-4 d-flex justify-content-center align-items-center gap-2">
                        <FaChalkboardTeacher /> {professor.PRO_Nome}
                      </Card.Title>

                      <div className="mb-2 d-flex justify-content-center align-items-center gap-2">
                        <FaEnvelope className="text-secondary" />
                        <strong>Email:</strong>
                        <span className="text-muted">{professor.PRO_Email}</span>
                      </div>

                      <div className="mb-2 d-flex justify-content-center align-items-center gap-2">
                        <FaPhone className="text-secondary" />
                        <strong>Celular:</strong>
                        <span className="text-muted">{professor.PRO_Celular}</span>
                      </div>

                      <div className="mb-2 d-flex justify-content-center align-items-center gap-2">
                        <FaIdCard className="text-secondary" />
                        <strong>CPF:</strong>
                        <span className="text-muted">{professor.PRO_CPF}</span>
                      </div>

                      <div className="mt-4" style={{ fontFamily: "'Archivo Black', sans-serif" }}>
                        {oficinasDoProfessor.length === 0 ? (
                          <span className="text-danger">Não leciona em nenhuma oficina</span>
                        ) : (
                          <div>
                            <strong>Oficinas:</strong> {oficinasDoProfessor.join(", ")}
                          </div>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            );
          })}
        </Row>
      </Container>

      {/* Botão flutuante com ícone */}
      <Link to="/cadastrarProfessor" className="fab-button" title="Adicionar Professor">
        <FaPlus size={24} />
      </Link>
    </main>
  );
}

export default Professores;
