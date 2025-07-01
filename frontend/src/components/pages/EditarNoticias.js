import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { FaPlus, FaArrowLeft } from "react-icons/fa";
import { Link, useParams, useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import ImgSobre from '../../img/fundo.jpg';

const API_URL = "http://localhost:8800/";

function EditarNoticias() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [noticia, setNoticia] = useState({
    titulo: '',
    classificacao: '',
    descricao: '',
    conteudo: '',
    imagem: ''
  });

  const [imagemPreview, setImagemPreview] = useState(null);
  const [imagemFile, setImagemFile] = useState(null);

  // Carregar dados da notícia
  useEffect(() => {
    axios.get(`${API_URL}noticias/${id}`)
      .then(res => {
        setNoticia(res.data);
        if (res.data.imagem) {
          setImagemPreview(API_URL + "uploads/" + res.data.imagem);
        }
      })
      .catch(err => {
        console.error("Erro ao buscar notícia:", err);
      });
  }, [id]);

  const handleInputChange = (e) => {
    setNoticia({ ...noticia, [e.target.name]: e.target.value });
  };

  const handleImagemChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagemFile(file);
      const url = URL.createObjectURL(file);
      setImagemPreview(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("titulo", noticia.titulo);
      formData.append("classificacao", noticia.classificacao);
      formData.append("descricao", noticia.descricao);
      formData.append("conteudo", noticia.conteudo);
      if (imagemFile) {
        formData.append("imagem", imagemFile);
      }

      await axios.put(`${API_URL}noticias/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Notícia atualizada com sucesso!");
      navigate("/gerenciamentoNoticias");
    } catch (error) {
      console.error("Erro ao atualizar notícia:", error);
      alert("Erro ao atualizar notícia.");
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
    <main className="container shadow">
      <Container>
        <Link
          to="/gerenciamentoNoticias"
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

      <Container>
        <Row>
          <Col xs={12} lg={4} className="p-0" style={{ height: '20vh', position: 'relative' }}>
            <div
              style={{
                height: '100%',
                width: '100%',
                backgroundImage: `url(${imagemPreview || ImgSobre})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Button
                as="label"
                htmlFor="upload-topo"
                style={{
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
                }}
              >
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
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Título:</Form.Label>
                <Form.Control
                  type="text"
                  name="titulo"
                  value={noticia.titulo}
                  onChange={handleInputChange}
                  className="fw-bold"
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    border: 'none'
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Classificação:</Form.Label>
                <Form.Control
                  type="text"
                  name="classificacao"
                  value={noticia.classificacao}
                  onChange={handleInputChange}
                  className="fw-bold"
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    border: 'none'
                  }}
                />
              </Form.Group>
            </Form>
          </Col>
        </Row>
      </Container>

      <Container>
        <Form>
          <Form.Group>
            <Form.Label className="fw-bold">Descrição</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="descricao"
              value={noticia.descricao}
              onChange={handleInputChange}
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                border: 'none',
              }}
            />
          </Form.Group>
        </Form>
      </Container>

      <Container>
        <Form>
          <Form.Group>
            <Form.Label className="fw-bold">Notícia</Form.Label>
            <Form.Control
              as="textarea"
              rows={20}
              name="conteudo"
              value={noticia.conteudo}
              onChange={handleInputChange}
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                border: 'none',
              }}
            />
          </Form.Group>
        </Form>
      </Container>

      <Container>
        <Row>
          <Col className="text-center">
            <Button
              onClick={handleSubmit}
              style={{ backgroundColor: "#ad0b0b", border: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}
            >
              Finalizar
            </Button>
          </Col>
        </Row>
      </Container>
    </main>
  );
}

export default EditarNoticias;
