import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { Form, Button } from 'react-bootstrap';
import InputMask from 'react-input-mask';
import { FaArrowLeft } from "react-icons/fa";
import { useParams } from "react-router-dom";
import axios from "axios";
import {Navigate , useNavigate} from "react-router-dom"; 

const EditarProfessor = () => {
  const { professorId } = useParams(); // Recebe o ID do professor pela URL

  const [dados, setDados] = useState({
    professor: {
      id: "",
      nome: "",
      email: "",
      celular: "",
      cpf: "",
    },
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axios.put(`http://localhost:8800/professores/${professorId}`, dados.professor);
      alert("Professor atualizado com sucesso!");
      navigate("/professores");  
    } catch (err) {
      console.error("Erro ao atualizar professor:", err);
      setError("Erro ao atualizar o professor.");
    } finally {
      setLoading(false);
    }
  };

  // Função para lidar com as mudanças no formulário
  const handleDadosProfessor = (e) => {
    const { name, value } = e.target;
    setDados((prevDados) => ({
      ...prevDados,
      professor: {
        ...prevDados.professor,
        [name]: value,
      },
    }));
  };

  // Função para carregar os dados do professor
  const carregarDadosProfessor = async () => {
    try {
      const response = await axios.get(`http://localhost:8800/professores/${professorId}`);
      const professorData = response.data;

      setDados({
        professor: {
          id: professorData.id,
          nome: professorData.nome,
          email: professorData.email,
          celular: professorData.celular,
          cpf: professorData.cpf,
        },
      });
    } catch (error) {
      console.error("Erro ao carregar dados do professor:", error);
    }
  };

  useEffect(() => {
    carregarDadosProfessor();
  }, [professorId]);

  return (
    <main className="container shadow p-4">

              {/* Cabeçalho vermelho */}
              <Container
                fluid
                className="d-flex align-items-center justify-content-center py-0"
                style={{ backgroundColor: '#ad0b0b', color: 'white', height: '10vh' }}
            >
                <h2
                style={{
                    fontFamily: 'Antonio, sans-serif',
                    fontSize: '3rem',
                    fontWeight: '700',
                    color: 'yellow',
                }}
                >
                Ficha de Inscrição
                </h2>
            </Container>

      <Container>
        <Link
          to="/professores"
          style={{
            textDecoration: 'none',
            color: '#ad0b0b',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <FaArrowLeft size={18} /> Voltar
        </Link>
      </Container>

      <Container className="justify-content-center">
        <Row className="justify-content-center">
          <Col className="col-md-10">
            <Row className="mb-4">
              <Col className="col-md-12" style={{ backgroundColor: 'rgba(173, 11, 11, 0.4)' }}>
                <Form.Label style={{ fontSize: '30px', fontWeight: 'bold' }}>Dados:</Form.Label>
              </Col>
            </Row>

            <Row className="mb-2">
              <Col className="col-md-2">
                <Form.Label style={{ fontSize: '22px', fontWeight: 'bold' }}>Nome:</Form.Label>
              </Col>
              <Col className="col-md-10">
                <Form.Control
                  type="text"
                  placeholder="Insira o nome completo do professor"
                  name="nome"
                  value={dados.professor.nome}
                  onChange={handleDadosProfessor}
                />
              </Col>
            </Row>

            <Row className="mb-2">
              <Col className="col-lg-2">
                <Form.Label style={{ fontSize: '22px', fontWeight: 'bold' }}>CPF:</Form.Label>
              </Col>
              <Col className="col-lg-3">
                <InputMask
                  mask="999.999.999-99"
                  className="form-control"
                  placeholder="000.000.000-00"
                  name="cpf"
                  value={dados.professor.cpf}
                  onChange={handleDadosProfessor}
                  readOnly
                />
              </Col>
            </Row>

            <Row className="mb-2">
              <Col className="col-lg-2">
                <Form.Label style={{ fontSize: '22px', fontWeight: 'bold' }}>Email:</Form.Label>
              </Col>
              <Col className="col-lg-3">
                <Form.Control
                  type="email"
                  placeholder="Insira o e-mail"
                  name="email"
                  value={dados.professor.email}
                  onChange={handleDadosProfessor}
                />
              </Col>
            </Row>

            <Row className="mb-2">
              <Col className="col-lg-2">
                <Form.Label style={{ fontSize: '22px', fontWeight: 'bold' }}>Telefone:</Form.Label>
              </Col>
              <Col className="col-lg-3">
                <InputMask
                  mask="(99) 99999-9999"
                  className="form-control"
                  placeholder="(00) 00000-0000"
                  name="celular"
                  value={dados.professor.celular}
                  onChange={handleDadosProfessor}
                />
              </Col>
            </Row>
          </Col>
        </Row>

        {error && (
          <Row className="mb-3">
            <Col className="text-center">
              <div className="alert alert-danger">{error}</div>
            </Col>
          </Row>
        )}

        <Row className='m-5'>
          <Col className="text-center">
            <Button
              style={{ fontSize: '20px', fontWeight: 'bold' }}
              variant="success"
              aria-label="Editar"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Cadastrando...' : 'Finalizar edição'}
            </Button>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default EditarProfessor;
