import './GerenciamentoNoticias.css';
import { Link, Navigate } from "react-router-dom"; 
import { Container, Row, Col, Button, Form, Table, Modal, Carousel } from 'react-bootstrap';
import { Dropdown } from 'react-bootstrap';
import { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaEdit, FaCalendarAlt, FaSave, FaArrowLeft, FaStar } from "react-icons/fa";
import croche from '../../img/croche.jpg';
import axios from "axios";

function GerenciamentoNoticias() {

  // Estados novos para avisos e notícias
  const [avisos, setAvisos] = useState([]);
  const [noticias, setNoticias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [tituloAviso, setTituloAviso] = useState('');
  const [descricaoAviso, setDescricaoAviso] = useState('');
  const [modoEdicao, setModoEdicao] = useState(false);
  const [avisoEditandoId, setAvisoEditandoId] = useState(null); // id para edição
  const API_URL = "http://localhost:8800/uploads/"; // ou seu domínio


  const [index, setIndex] = useState(0);
  const [favoritas, setFavoritas] = useState([]);

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

  // Mantém estados para edição de notícia (simples, para exemplo)
  // Pode expandir para editar notícias também
  const [noticiaEditandoId, setNoticiaEditandoId] = useState(null);

  // Funções do modal
  const handleClose = () => {
    setShowModal(false);
    setTituloAviso('');
    setDescricaoAviso('');
    setModoEdicao(false);
    setAvisoEditandoId(null);
  };

  const handleShowAdicionar = () => {
    setModoEdicao(false);
    setTituloAviso('');
    setDescricaoAviso('');
    setAvisoEditandoId(null);
    setShowModal(true);
  };

  // Agora carrega os dados do aviso para edição pelo id
  const handleEditarAviso = (aviso) => {
    setModoEdicao(true);
    setTituloAviso(aviso.titulo);
    setDescricaoAviso(aviso.descricao);
    setAvisoEditandoId(aviso.id);
    setShowModal(true);
  };

  const handleSalvarAviso = async () => {
  const avisoPayload = {
    titulo: tituloAviso,
    descricao: descricaoAviso
  };

  try {
    if (modoEdicao) {
      // Editar aviso existente (PUT)
      const response = await fetch(`http://localhost:8800/avisos/${avisoEditandoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(avisoPayload)
      });

      if (!response.ok) throw new Error('Erro ao editar o aviso');

      const avisoAtualizado = await response.json();

      // Atualizar no estado local
      setAvisos(prev => prev.map(a =>
        a.AVS_Id === avisoEditandoId ? { ...a, AVS_Titulo: avisoPayload.titulo, AVS_Descricao: avisoPayload.descricao } : a
      ));

    } else {
      // Criar novo aviso (POST)
      const response = await fetch('http://localhost:8800/avisos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(avisoPayload)
      });

      if (!response.ok) throw new Error('Erro ao adicionar o aviso');

      const novoAviso = await response.json(); // já retorna com ID do banco

      setAvisos(prev => [novoAviso, ...prev]);
    }

    fetch('http://localhost:8800/avisos')
      .then(res => res.json())
      .then(data => setAvisos(data))
      .catch(err => console.error('Erro ao carregar avisos:', err));


    handleClose();
  } catch (error) {
    console.error("Erro ao salvar aviso:", error);
    alert("Ocorreu um erro ao salvar o aviso. Verifique o console.");
  }
  };

  // Busca inicial dos avisos e notícias
  useEffect(() => {
    // Buscar avisos
    fetch('http://localhost:8800/avisos')
      .then(res => res.json())
      .then(data => setAvisos(data))
      .catch(err => console.error('Erro ao carregar avisos:', err));

    // Buscar notícias
    fetch('http://localhost:8800/noticias')
      .then(res => res.json())
      .then(data => setNoticias(data))
      .catch(err => console.error('Erro ao carregar notícias:', err));
  }, []);

  // Manter o fetch de eventos intacto (seu código original)
  const [eventos, setEventos] = useState([]);
  useEffect(() => {
    fetch('http://localhost:8800/eventos')
      .then(res => res.json())
      .then(data => {
        const eventosFormatados = data.map(e => ({
          id: e.id,
          data: new Date(e.data_evento).toLocaleDateString('pt-BR'),
          tipoEvento: e.tipo_evento
        }));
        setEventos(eventosFormatados);
      })
      .catch(err => {
        console.error('Erro ao carregar eventos:', err);
      });
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
    <main className='container shadow p-4'>

      {/* Modal Aviso */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{modoEdicao ? "Editar Aviso" : "Adicionar Aviso"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o título"
                value={tituloAviso}
                onChange={(e) => setTituloAviso(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Digite a descrição"
                value={descricaoAviso}
                onChange={(e) => setDescricaoAviso(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            <FaArrowLeft className="me-2" /> Voltar
          </Button>
          <Button variant="primary" onClick={handleSalvarAviso}>
            <FaSave className="me-2" /> Salvar
          </Button>
        </Modal.Footer>
      </Modal>

      <h1 className='mb-2' style={{ fontFamily: 'Antonio, sans-serif', fontSize: '3.5rem', fontWeight: '700' }}>
        Notícias
      </h1>

      <Container>
        {/* Renderização dinâmica dos avisos do banco */}
        {avisos.map(aviso => (
          <div key={aviso.id} className="noticia-hover-container position-relative mb-3">
                <div key={aviso.id}>
                  <div className="m-0">
                    <div
                      className="fw-bold shadow-none"
                      style={{
                        fontFamily: 'Antonio, sans-serif',
                        fontSize: '2.5rem',
                        fontWeight: '700',
                        color: '#ad0b0b',
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word',
                        whiteSpace: 'normal',
                        minHeight: 'calc(2.5rem + 0.75rem + 2px)',
                        display: 'flex',
                        alignItems: 'center'
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
                        whiteSpace: 'pre-wrap',
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word'
                      }}
                    >
                      {aviso.descricao}
                    </div>
                  </div>
                </div>

                <div className="icon-actions mt-2">
                  <span
                    onClick={() => handleEditarAviso(aviso)}
                    title="Editar"
                    style={{ cursor: 'pointer' }}
                  >
                    <FaEdit className="me-2 action-icon" />
                  </span>
                  <FaTrash
                    className="action-icon"
                    title="Excluir"
                    style={{ cursor: 'pointer' }}
                    onClick={async () => {
                      const confirmDelete = window.confirm("Tem certeza que deseja excluir este aviso?");
                      if (confirmDelete) {
                        try {
                          const response = await fetch(`http://localhost:8800/avisos/${aviso.id}`, {
                            method: 'DELETE'
                          });
                          if (!response.ok) throw new Error('Erro ao excluir o aviso');

                          // Atualiza estado local removendo aviso excluído
                          setAvisos(prev => prev.filter(a => a.id !== aviso.id));
                        } catch (error) {
                          console.error('Erro ao excluir aviso:', error);
                          alert('Erro ao excluir o aviso. Veja o console para mais detalhes.');
                        }
                      }
                    }}
                  />
                </div>
          </div>
        ))}
      </Container>


      {/* Calendário e Destaques*/}

      <Container>
        <Row>

          {/* Calendário de eventos*/}

          <Col md={12} lg={favoritas.length === 0 ? 12 : 5}>
            <h2 className='mb-3 text-center' style={{ fontFamily: 'Antonio, sans-serif', color: '#ad0b0b' }}>Calendário de Eventos</h2>
            <div className="tabela-hover-container position-relative mb-4">
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                <Table striped bordered hover>
                  <tbody>
                    {eventos.map((evento, index) => (
                      <tr key={evento.id} style={{ height: '40px' }}>
                        <td style={{ width: '5%', textAlign: 'center' }}>
                          <FaCalendarAlt />
                        </td>
                        <td style={{ width: '95%' }}>
                          <strong>{evento.data}</strong> - {evento.tipoEvento}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              <div className="icon-actions">
                <Link to="/calendarioEventos" title="Editar">
                  <FaEdit className="me-2 action-icon" />
                </Link>
                <Link to="/calendarioEventos" title="Excluir">
                  <FaTrash className="action-icon" />
                </Link>
              </div>
            </div>
          </Col>

          {/* Destaques*/}

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
                      <div style={{ position: 'relative', height: '300px' }}>
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

                      <div className="icon-actions">
                        {noticia.favorito ? (
                          <FaStar
                            className="me-2 action-icon"
                            title="Remover dos Favoritos"
                            color="#FFD700"
                            style={{ cursor: 'pointer' }}
                            onClick={async () => {
                              try {
                                await axios.patch(`http://localhost:8800/noticias/noticias/favorito/${noticia.id}`, {
                                  favorito: false
                                });

                                // Atualiza o estado das notícias para re-renderizar o ícone
                                setNoticias(prev =>
                                  prev.map(n =>
                                    n.id === noticia.id ? { ...n, favorito: false } : n
                                  )
                                );

                                // Atualiza o estado das favoritas, removendo a notícia removida
                                setFavoritas(prev => prev.filter(n => n.id !== noticia.id));

                              } catch (error) {
                                console.error("Erro ao remover dos favoritos:", error);
                                alert("Erro ao atualizar favorito.");
                              }
                            }}
                          />
                        ) : (
                          <FaStar
                            className="me-2 action-icon-favorito"
                            title="Adicionar aos favoritos"
                            style={{ cursor: 'pointer' }}
                            onClick={async () => {
                              try {
                                await axios.patch(`http://localhost:8800/noticias/noticias/favorito/${noticia.id}`, {
                                  favorito: true,
                                });
                                setFavoritas((prev) =>
                                  prev.map((n) =>
                                    n.id === noticia.id ? { ...n, favorito: true } : n
                                  )
                                );
                              } catch (error) {
                                console.error("Erro ao adicionar aos favoritos:", error);
                                alert("Erro ao atualizar favorito.");
                              }
                            }}
                          />
                        )}

                        <Link to={`/editarNoticias/${noticia.id}`} title="Editar">
                          <FaEdit className="me-2 action-icon-carousel" /> 
                        </Link>

                        <FaTrash
                          className="action-icon-carousel"
                          title="Excluir"
                          style={{ cursor: 'pointer' }}
                          onClick={async () => {
                            const confirmDelete = window.confirm("Tem certeza que deseja excluir esta notícia?");
                            if (confirmDelete) {
                              try {
                                await axios.delete(`http://localhost:8800/noticias/${noticia.id}`);
                                setFavoritas(prev => prev.filter(n => n.id !== noticia.id));
                                alert("Notícia excluída com sucesso.");

                              } catch (error) {
                                console.error("Erro ao excluir:", error);
                                alert("Erro ao excluir notícia. Tente novamente.");
                              }
                            }
                          }}
                        />
                      </div>
                    </Carousel.Item>
                  ))}
                </Carousel>
              </div>
            </Col>
          )}
        </Row>
      </Container>



      {/* Renderização dinâmica das notícias do banco */}
      <Container>
        <h2 style={{ fontFamily: 'Antonio, sans-serif', fontSize: '2rem', color: '#ad0b0b', marginBottom: '1rem' }}>Últimas Notícias</h2>
        {noticias.map(noticia => (
          <div key={noticia.id} className="noticia-hover-container position-relative mb-4">
            <Row className="align-items-center">
              <Col xs={12} lg={4}>
                <img
                  src={noticia.imagem ? API_URL + noticia.imagem : croche}
                  alt="Imagem da notícia"
                  className="img-fluid rounded"
                  style={{
                    height: '20vh',
                    width: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Col>

              <Col xs={12} lg={8}>
                <div className="mb-2 mt-2">
                  <div
                    className="fw-bold shadow-none"
                    style={{
                      fontSize: '1rem',
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                      whiteSpace: 'normal'
                    }}
                  >
                    {noticia.classificacao || ''}
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
                <div className="mb-2">
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
                <div className="m-0">
                  <div
                    className="fw-bold shadow-none"
                    style={{
                      fontSize: '1rem',
                      color: '#6c757d',
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

            <div className="icon-actions">
                {noticia.favorito ? (
                  <FaStar
                    className="me-2 action-icon"
                    title="Remover dos Favoritos"
                    color="#FFD700"
                    style={{ cursor: 'pointer' }}
                    onClick={async () => {
                      try {
                        await axios.patch(`http://localhost:8800/noticias/noticias/favorito/${noticia.id}`, {
                          favorito: false
                        });

                        // Atualiza as notícias
                        setNoticias(prev =>
                          prev.map(n =>
                            n.id === noticia.id ? { ...n, favorito: false } : n
                          )
                        );

                        // Remove dos favoritos
                        setFavoritas(prev => prev.filter(n => n.id !== noticia.id));
                        
                      } catch (error) {
                        console.error("Erro ao remover dos favoritos:", error);
                        alert("Erro ao atualizar favorito.");
                      }
                    }}
                  />
                ) : (
                  <FaStar
                    className="me-2 action-icon-favorito"
                    title="Adicionar aos favoritos"
                    style={{ cursor: 'pointer' }}
                    onClick={async () => {
                        if (favoritas.length >= 5) {
                          alert("Você só pode adicionar até 5 notícias aos favoritos.");
                          return;
                        }

                        try {
                          await axios.patch(`http://localhost:8800/noticias/noticias/favorito/${noticia.id}`, {
                            favorito: true
                          });

                          setNoticias(prev =>
                            prev.map(n =>
                              n.id === noticia.id ? { ...n, favorito: true } : n
                            )
                          );

                          setFavoritas(prev => {
                            const existe = prev.find(n => n.id === noticia.id);
                            if (!existe) {
                              return [...prev, { ...noticia, favorito: true }];
                            }
                            return prev;
                          });
                        } catch (error) {
                          console.error("Erro ao adicionar aos favoritos:", error);
                          alert("Erro ao atualizar favorito.");
                        }
                      }}

                  />
                )}

                <Link to={`/editarNoticias/${noticia.id}`} title="Editar">
                  <FaEdit className="me-2 action-icon" />
                </Link>

                <FaTrash
                  className="action-icon"
                  title="Excluir"
                  style={{ cursor: 'pointer' }}
                  onClick={async () => {
                    const confirmDelete = window.confirm("Tem certeza que deseja excluir esta notícia?");
                    if (confirmDelete) {
                      try {
                        await axios.delete(`http://localhost:8800/noticias/${noticia.id}`);
                        setNoticias(prev => prev.filter(n => n.id !== noticia.id));
                        alert("Notícia excluída com sucesso.");
                        setFavoritas(prev => prev.filter(n => n.id !== noticia.id));
                        
                      } catch (error) {
                        console.error("Erro ao excluir:", error);
                        alert("Erro ao excluir notícia. Tente novamente.");
                      }
                    }
                  }}
                />
              </div>
            <div className="border-bottom m-3"></div>
          </div>
        ))}
      </Container>

      <Dropdown drop="up" className="fab-dropdown">
        <Dropdown.Toggle id="dropdown-fab" className="fab-button" title="Ações">
          <FaPlus size={24} />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {[
            { nome: "Adicionar Notícia", rota: "/criarNoticias", ativa: true },
            { nome: "Adicionar Evento no Calendário", rota: "/calendarioEventos", ativa: true },
            { nome: "Adicionar Aviso", rota: "/outraOpcao2", ativa: false },
          ].map((opcao, index) => (
            opcao.nome === "Adicionar Aviso" ? (
              <Dropdown.Item key={index} onClick={handleShowAdicionar}>
                {opcao.nome}
              </Dropdown.Item>
            ) : (
              <Dropdown.Item
                key={index}
                as={opcao.ativa ? Link : "div"}
                to={opcao.ativa ? opcao.rota : undefined}
                disabled={!opcao.ativa}
              >
                {opcao.nome}
              </Dropdown.Item>
            )
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </main>
  );
}

export default GerenciamentoNoticias;
