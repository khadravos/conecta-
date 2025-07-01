import { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import InputMask from 'react-input-mask';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate, Navigate } from "react-router-dom";

function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;

  return resto === parseInt(cpf.charAt(10));
}

function CadastrarProfessor() {
  const [dados, setDados] = useState({
    professor: {
      nomeCompleto: "",
      cpf: "",
      email: "",
      telefone: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [cpfInvalido, setCpfInvalido] = useState(false);
  const navigate = useNavigate();

  const handledados = (e) => {
    const { name, value } = e.target;
    setDados((prevDados) => ({
      ...prevDados,
      professor: {
        ...prevDados.professor,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setCpfInvalido(false);

    const cpfValido = validarCPF(dados.professor.cpf);

    if (!cpfValido) {
      setCpfInvalido(true);
      setLoading(false);
      return;
    }

    try {
      await axios.post('http://localhost:8800/professores', {
        nome: dados.professor.nomeCompleto,
        cpf: dados.professor.cpf,
        email: dados.professor.email,
        celular: dados.professor.telefone,
      });

      alert('Professor cadastrado com sucesso!');
      navigate("/professores");  
    } catch (err) {
      console.error('Erro ao cadastrar o professor:', err);
    } finally {
      setLoading(false);
    }
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
                  name="nomeCompleto"
                  value={dados.professor.nomeCompleto}
                  onChange={handledados}
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
                  onChange={handledados}
                />
                {cpfInvalido && (
                  <div className="text-danger" style={{ fontSize: '0.9rem', marginTop: '4px' }}>
                    CPF inválido.
                  </div>
                )}
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
                  onChange={handledados}
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
                  name="telefone"
                  value={dados.professor.telefone}
                  onChange={handledados}
                />
              </Col>
            </Row>
          </Col>
        </Row>

        <Row className='m-5'>
          <Col className="text-center">
            <Button 
              style={{ fontSize: '20px', fontWeight: 'bold' }}
              variant="success"
              aria-label="Finalizar cadastro do professor"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Cadastrando...' : 'Finalizar Inscrição'}
            </Button>
          </Col>
        </Row>
      </Container>
    </main>
  );
}

export default CadastrarProfessor;
