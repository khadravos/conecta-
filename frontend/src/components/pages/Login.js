import { Container, Row, Col, Button, Form, InputGroup, Modal } from 'react-bootstrap';
import { FaUser, FaLock } from "react-icons/fa";
import React, { useState } from 'react';
import login from '../../img/loging.png'; 
import logo from '../../img/logoGAaj.png'; 
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [showNewPasswordModal, setShowNewPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const navigate = useNavigate();

  // Login
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:8800/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        navigate("/matriculas");
      } else {
        alert(data.error || "Erro no login.");
      }
    } catch (error) {
      alert("Erro ao se conectar ao servidor.");
    }
  };

  // Envia e-mail de recuperação
  const handleRecoverySubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8800/email/recuperar-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: recoveryEmail }),
      });
      const data = await response.json();

      if (response.ok) {
        setShowModal(false);
        setShowCodeModal(true);
      } else {
        alert(data.error || "Erro ao enviar e-mail.");
      }
    } catch (error) {
      alert("Erro ao se conectar ao servidor.");
    }
  };

  // Verifica código de recuperação
  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8800/token/verificar-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: recoveryEmail, token: verificationCode }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setShowCodeModal(false);
        setShowNewPasswordModal(true);
      } else {
        alert(data.error || "Código inválido!");
      }
    } catch (error) {
      alert("Erro ao se conectar ao servidor.");
    }
  };

  // Atualiza a senha no banco
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8800/token/redefinir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: recoveryEmail, novaSenha: newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Senha atualizada com sucesso!");
        setShowNewPasswordModal(false);
      } else {
        alert(data.error || "Erro ao atualizar a senha 123.");
      }
    } catch (error) {
      alert("Erro ao se conectar ao servidor.");
    }
  };

  return (
    <Container fluid style={{ backgroundColor: "#ad0b0b" }}>
      <Container className="d-flex justify-content-center">
        <Row className="flex-column-reverse flex-lg-row d-flex justify-content-between">
          <Col lg={7} className="d-flex align-items-center justify-content-center">
            <img src={login} className="img-fluid" alt="Imagem de login" />
          </Col>

          <Col lg="auto" className="d-flex align-items-center justify-content-center">
            <Container className="mt-3 d-flex flex-column align-items-center justify-content-center" style={{ backgroundColor: "#fff", borderRadius: "10px", padding: "20px", width: "auto" }}>
              <img src={logo} alt="Logo" className="img-fluid" style={{ maxWidth: "100px" }} />
              <h1 style={{ fontFamily: "'Lora', serif", letterSpacing: "0.01em", fontWeight: "700" }}>Bem-vindo</h1>
              <p className='fw-bold' style={{ color: "#ad0b0b" }}>Administrador</p>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email:</Form.Label>
                  <InputGroup>
                    <InputGroup.Text><FaUser style={{ color: "#ad0b0b" }} /></InputGroup.Text>
                    <Form.Control type="email" placeholder="Insira seu Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Senha:</Form.Label>
                  <InputGroup>
                    <InputGroup.Text><FaLock style={{ color: "#ad0b0b" }} /></InputGroup.Text>
                    <Form.Control type="password" placeholder="Insira sua senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
                  </InputGroup>
                </Form.Group>

                <Button type="submit" className="mb-2" style={{ backgroundColor: "#ad0b0b", borderColor: "#ad0b0b", width: "100%" }}>
                  Entrar
                </Button>

                <div className="text-center">
                  <span onClick={() => setShowModal(true)} style={{ color: "#ad0b0b", cursor: "pointer", fontSize: "0.9rem" }}>
                    Esqueceu sua senha?
                  </span>
                </div>
              </Form>
            </Container>
          </Col>
        </Row>
      </Container>

      {/* Modal: Recuperar Senha */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Recuperar Senha</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleRecoverySubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email cadastrado</Form.Label>
              <Form.Control type="email" placeholder="Digite seu e-mail" value={recoveryEmail} onChange={(e) => setRecoveryEmail(e.target.value)} />
            </Form.Group>
            <Button type="submit" style={{ backgroundColor: "#ad0b0b", borderColor: "#ad0b0b" }}>
              Enviar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal: Código */}
      <Modal show={showCodeModal} onHide={() => setShowCodeModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Digite o código</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCodeSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Código de verificação</Form.Label>
              <Form.Control type="text" placeholder="Insira os 6 dígitos" maxLength={6} value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} />
            </Form.Group>
            <Button type="submit" style={{ backgroundColor: "#ad0b0b", borderColor: "#ad0b0b" }}>
              Verificar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal: Nova Senha */}
      <Modal show={showNewPasswordModal} onHide={() => setShowNewPasswordModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Redefinir Senha</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdatePassword}>
            <Form.Group className="mb-3">
              <Form.Label>Nova Senha</Form.Label>
              <Form.Control type="password" placeholder="Digite a nova senha" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </Form.Group>
            <Button type="submit" style={{ backgroundColor: "#ad0b0b", borderColor: "#ad0b0b" }}>
              Atualizar Senha
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default Login;
