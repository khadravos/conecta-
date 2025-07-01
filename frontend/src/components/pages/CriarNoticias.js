import { Container, Row, Col, Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { FaPlus, FaArrowLeft } from "react-icons/fa";
import ImgSobre from '../../img/fundo.jpg';
import React, { useEffect, useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import axios from 'axios';

function CriarNoticias() {
  const [imagem, setImagem] = useState(null);
  const navigate = useNavigate();
  const [imagemPreview, setImagemPreview] = useState(null);
  const [titulo, setTitulo] = useState('');
  const [classificacao, setClassificacao] = useState('');
  const [descricao, setDescricao] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImagemChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagem(file);
      setImagemPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!titulo || !descricao || !conteudo) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (!imagem) {
      alert("Você não selecionou uma imagem.");
    }

    const formData = new FormData();
    formData.append("imagem", imagem);
    formData.append("titulo", titulo);
    formData.append("descricao", descricao);
    formData.append("conteudo", conteudo);
    formData.append("classificacao", classificacao);

    try {
      setIsSubmitting(true);
      await axios.post("http://localhost:8800/noticias", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Notícia cadastrada com sucesso!");

      setTitulo("");
      setDescricao("");
      setConteudo("");
      setClassificacao("");
      setImagem(null);
      setImagemPreview(null);
      navigate("/gerenciamentoNoticias");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Erro ao cadastrar notícia. Tente novamente mais tarde.");
    } finally {
      setIsSubmitting(false);
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

  const imagemDeFundo = imagemPreview || ImgSobre;

  return (
    <main className='container shadow py-4'>
      <Container>
        <Link to="/gerenciamentoNoticias" style={{ textDecoration: 'none', color: '#ad0b0b', fontWeight: 'bold', fontSize: '1.2rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <FaArrowLeft size={18} /> Voltar
        </Link>
      </Container>

      <Container>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-4">
            <Col xs={12} lg={4} className="p-0" style={{ height: '20vh', position: 'relative' }}>
              <div style={{
                height: '100%',
                width: '100%',
                backgroundImage: `url(${imagemDeFundo})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Button as="label" htmlFor="upload-topo" style={{
                  zIndex: 2,
                  backgroundColor: '#ccc',
                  color: '#333',
                  border: 'none',
                  borderRadius: '50%',
                  width: '80px',
                  height: '80px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  cursor: 'pointer'
                }}>
                  <FaPlus size={32} />
                </Button>
                <input
                  id="upload-topo"
                  type="file"
                  accept="image/*"
                  onChange={handleImagemChange}
                  style={{ display: 'none' }}
                />
              </div>
            </Col>

            <Col xs={12} lg={8}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Título:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Título"
                      className="fw-bold"
                      value={titulo}
                      onChange={(e) => setTitulo(e.target.value)}
                      style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', border: 'none' }}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Classificação:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Classificação"
                      className="fw-bold"
                      value={classificacao}
                      onChange={(e) => setClassificacao(e.target.value)}
                      style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', border: 'none' }}
                    />
                  </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Descrição:</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Digite uma descrição para a notícia"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', border: 'none' }}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="fw-bold">Notícia:</Form.Label>
            <Form.Control
              as="textarea"
              rows={20}
              placeholder="Digite a notícia"
              value={conteudo}
              onChange={(e) => setConteudo(e.target.value)}
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', border: 'none' }}
            />
          </Form.Group>

          <div className="text-center">
            <Button type="submit" disabled={isSubmitting} style={{ backgroundColor: "#ad0b0b", border: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>
              {isSubmitting ? "Enviando..." : "Finalizar"}
            </Button>
          </div>
        </Form>
      </Container>
    </main>
  );
}

export default CriarNoticias;
