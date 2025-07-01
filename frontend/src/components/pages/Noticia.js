import './GerenciamentoNoticias.css';
import { Container, Row, Col, Form, Table, Carousel } from 'react-bootstrap';
import { FaCalendarAlt } from 'react-icons/fa';
import React, { useState, useEffect } from "react";
import { Modal, Button } from 'react-bootstrap';
import croche from '../../img/croche.jpg';
import axios from "axios";

const API_URL = 'http://localhost:8800/'; // ajuste conforme seu back

function Noticia() {
  const [avisos, setAvisos] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [noticias, setNoticias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [noticiaSelecionada, setNoticiaSelecionada] = useState(null);
  const [noticiasVisiveis, setNoticiasVisiveis] = useState(5);
  const [favoritas, setFavoritas] = useState([]);

  const [index, setIndex] = useState(0);
  
    const handleSelect = (selectedIndex) => {
      setIndex(selectedIndex);
    };

    useEffect(() => {
    const fetchFavoritas = async () => {
      try {
        const res = await axios.get('http://localhost:8800/noticias/noticias/favorito');
        setFavoritas(res.data);
      } catch (err) {
        console.error('Erro ao buscar favoritas:', err);
      }
    };

    fetchFavoritas();
  }, []);
  
  const carregarMaisNoticias = () => {
  setNoticiasVisiveis(prev => prev + 5);
  };

  const handleOpenModal = (noticia) => {
    setNoticiaSelecionada(noticia);
    setShowModal(true);
  };

  

  const handleCloseModal = () => {
    setShowModal(false);
    setNoticiaSelecionada(null);
  };


  useEffect(() => {
    fetch(API_URL + 'avisos')
      .then(res => res.json())
      .then(data => setAvisos(data))
      .catch(err => console.error('Erro ao carregar avisos:', err));

    fetch(API_URL + 'eventos')
      .then(res => res.json())
      .then(data => {
        const eventosFormatados = data.map(e => ({
          id: e.id,
          data: new Date(e.data_evento).toLocaleDateString('pt-BR'),
          tipoEvento: e.tipo_evento
        }));
        setEventos(eventosFormatados);
      })
      .catch(err => console.error('Erro ao carregar eventos:', err));

    fetch(API_URL + 'noticias')
      .then(res => res.json())
      .then(data => setNoticias(data))
      .catch(err => console.error('Erro ao carregar notícias:', err));
  }, []);

  useEffect(() => {
  axios.get(`${API_URL}noticias`)
    .then(response => {
      const noticiasOrdenadas = response.data.sort((a, b) => new Date(b.data) - new Date(a.data));
      setNoticias(noticiasOrdenadas);
    })
    .catch(error => {
      console.error("Erro ao buscar notícias:", error);
    });
  }, []);


  return (
    <main className='container shadow p-4'>
      <h1
        className='mb-2'
        style={{
          fontFamily: 'Antonio, sans-serif',
          fontSize: '3.5rem',
          fontWeight: '700'
        }}
      >
        Notícias
      </h1>

      {/* Lista de Avisos com FormGroups */}
      <Container>
        {avisos.length === 0 && <p>Nenhum aviso disponível.</p>}
        {avisos.map(aviso => (
          <div key={aviso.id}>
            <div className="m-0">
              <label
                style={{ fontFamily: 'Antonio, sans-serif', fontSize: '1.5rem' }}
              >
                Aviso
              </label>

              <div
                className="fw-bold shadow-none"
                style={{
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  whiteSpace: 'normal',
                  maxWidth: '100%',
                  fontFamily: 'Antonio, sans-serif',
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  color: '#ad0b0b',
                }}
              >
                {aviso.titulo}
              </div>
            </div>

            <div style={{ marginTop: '0.5rem' }}>
              <div
                className="fw-bold shadow-none"
                style={{
                  fontSize: '1.3rem',
                  color: '#6c757d',
                  whiteSpace: 'pre-wrap', // mantém quebras de linha no texto
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word'
                }}
              >
                {aviso.descricao}
              </div>
            </div>
          </div>
        ))}
      </Container>


      {/* Tabela de Eventos */}
      <Container>
        <Row>
          <Col md={12} lg={favoritas.length === 0 ? 12 : 5}>
            <h2 className='mb-3 text-center' style={{ fontFamily: 'Antonio, sans-serif', color: '#ad0b0b' }}>Calendário de Eventos</h2>
            <div className='mb-4' style={{ maxHeight: '300px', overflowY: 'auto'}}>
              <Table striped bordered hover>
                <tbody>
                  {eventos.map(evento => (
                    <tr key={evento.id} style={{ height: '40px' }}>
                      <td style={{ width: '5%', textAlign: 'center' }}>
                        <FaCalendarAlt />
                      </td>
                      <td style={{ width: '95%' }}>
                        <strong>{evento.data}</strong> - {evento.tipoEvento}
                      </td>
                    </tr>
                  ))}
                  {eventos.length === 0 && (
                    <tr><td colSpan={2} style={{ textAlign: 'center' }}>Nenhum evento cadastrado.</td></tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Col>

          {favoritas.length > 0 && (
            <Col>
              <h2 className='mb-3 text-center' style={{ fontFamily: 'Antonio, sans-serif', color: '#ad0b0b' }}>Destaques</h2>
              <div
                className="carousel-hover-container position-relative mb-4"
                style={{ maxHeight: '300px', overflow: 'hidden' }}
              >
                <Carousel activeIndex={index} onSelect={handleSelect} style={{ height: '300px' }}>
                  {favoritas.map((noticia, idx) => (
                    <Carousel.Item key={noticia.id}>
                      <div onClick={() => handleOpenModal(noticia)} style={{ position: 'relative', height: '300px' }}>
                        <img
                          className="d-block w-100"
                          src={`http://localhost:8800/uploads/${noticia.imagem}`}
                          alt={`Slide ${idx + 1}`}
                          style={{ height: '300px', objectFit: 'cover' }}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0, 0, 0, 0.4)',
                          }}
                        />
                      </div>
                      <Carousel.Caption>
                        <h2 style={{ fontFamily: 'Antonio, sans-serif'}}>{noticia.titulo}</h2>
                      </Carousel.Caption>
                    </Carousel.Item>
                  ))}
                </Carousel>
              </div>
            </Col>
          )}
        </Row>
      </Container>

      {/* Notícias */}
      <Container>
        <h2 style={{ fontFamily: 'Antonio, sans-serif', fontSize: '2rem', color: '#ad0b0b', marginBottom: '1rem' }}>Últimas Notícias</h2>
        {noticias.length === 0 && <p>Nenhuma notícia cadastrada.</p>}
        {noticias.slice(0, noticiasVisiveis).map(noticia => (
          <div key={noticia.id}>
            <div onClick={() => handleOpenModal(noticia)} style={{ cursor: 'pointer' }}>
              <Row className="mb-4 align-items-center shadow py-2">
                <Col xs={12} lg={4}>
                  <img
                    src={noticia.imagem ? API_URL + 'uploads/' + noticia.imagem : croche}
                    alt={noticia.titulo}
                    className="img-fluid rounded"
                    style={{ height: '20vh', width: '100%', objectFit: 'cover' }}
                  />
                </Col>

                <Col xs={12} lg={8}>
                  {/* Classificação */}
                    <div style={{ marginTop: '0.5rem' }}>
                      <div
                        className="fw-bold shadow-none"
                        style={{
                          fontSize: '1rem',
                          wordWrap: 'break-word',
                          overflowWrap: 'break-word',
                          whiteSpace: 'normal',
                        }}
                      >
                        {noticia.classificacao}
                      </div>
                    </div>

                    {/* Data */}
                    <div style={{ marginTop: '0.3rem' }}>
                      <div
                        style={{
                          fontSize: '0.9rem',
                          fontWeight: '500',
                          color: '#555',
                          fontFamily: 'Antonio, sans-serif'
                        }}
                      >
                        {new Date(noticia.data).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                  {/* Título */}
                  <div style={{ marginTop: '0.5rem' }}>
                    <div
                      className="fw-bold shadow-none"
                      style={{
                        fontFamily: 'Antonio, sans-serif',
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        color: '#ad0b0b',
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word',
                        whiteSpace: 'normal',
                      }}
                    >
                      {noticia.titulo}
                    </div>
                  </div>

                  {/* Descrição */}
                  <div style={{ marginTop: '0.5rem' }}>
                    <div
                      className="fw-bold shadow-none"
                      style={{
                        fontSize: '1rem',
                        color: '#6c757d',
                        backgroundColor: '#fff',
                        whiteSpace: 'pre-wrap',
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word'
                      }}
                    >
                      {noticia.descricao}
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
            <div className="border-bottom mb-3"></div>
          </div>
        ))}

        {noticiasVisiveis < noticias.length && (
            <div className="text-center mt-3">
              <Button variant="outline-danger" onClick={carregarMaisNoticias}>
                Mostrar mais
              </Button>
            </div>
          )}
      </Container>

      
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title
            style={{
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              whiteSpace: 'normal',
              maxWidth: '100%',
              fontFamily: 'Antonio, sans-serif',
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#ad0b0b'
            }}
          >
            {noticiaSelecionada?.titulo}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img
              src={noticiaSelecionada?.imagem ? API_URL + 'uploads/' + noticiaSelecionada.imagem : croche}
              alt={noticiaSelecionada?.titulo}
              className="img-fluid rounded mb-3"
              style={{ maxWidth: '600px', maxHeight: '400px', width: '100%', height: 'auto' }}
            />
          </div>
          <p className="fw-bold" style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
            {noticiaSelecionada?.descricao}
          </p>
          <p style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
            {noticiaSelecionada?.conteudo}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </main>
  );
}

export default Noticia;
