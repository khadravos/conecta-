import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap';
import InputMask from 'react-input-mask';
import { FaCalendarAlt, FaArrowLeft, FaTrash } from 'react-icons/fa';
import { Link, Navigate } from "react-router-dom";

function CalendarioEventos() {
  const [eventos, setEventos] = useState([]);
  const [novaData, setNovaData] = useState('');
  const [tipoEvento, setTipoEvento] = useState('');
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const parseData = (dataStr) => {
    const [dia, mes, ano] = dataStr.split('/');
    return new Date(`${ano}-${mes}-${dia}`);
  };

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

  const handleAddEvento = () => {
    if (!novaData || !tipoEvento) {
      alert('Preencha todos os campos.');
      return;
    }

    const [dia, mes, ano] = novaData.split('/');
    const dataFormatada = `${ano}-${mes}-${dia}`;

    fetch('http://localhost:8800/eventos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data_evento: dataFormatada,
        tipo_evento: tipoEvento
      })
    })
      .then(res => res.json())
      .then(() => {
        // Após salvar, refaz a consulta no backend para atualizar a lista
        fetch('http://localhost:8800/eventos')
          .then(res => res.json())
          .then(data => {
            const eventosFormatados = data.map(e => ({
              id: e.id,
              data: new Date(e.data_evento).toLocaleDateString('pt-BR'),
              tipoEvento: e.tipo_evento
            }));
            setEventos(eventosFormatados);
          });

        setNovaData('');
        setTipoEvento('');
      })
      .catch(err => {
        console.error('Erro ao salvar evento:', err);
        alert('Erro ao salvar evento.');
      });
  };


  const handleDeleteEvento = (id) => {
    if (!window.confirm('Deseja realmente excluir este evento?')) return;

    fetch(`http://localhost:8800/eventos/${id}`, {
      method: 'DELETE',
    })
      .then(res => {
        if (!res.ok) throw new Error('Erro ao excluir');
        setEventos(prev => prev.filter(e => e.id !== id));
      })
      .catch(err => {
        console.error('Erro ao excluir evento:', err);
        alert('Erro ao excluir evento.');
      });
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
    <main className='container shadow'>
      <Container fluid className="d-flex align-items-center justify-content-center" style={{ backgroundColor: '#ad0b0b', height: '15vh' }}>
        <h2 className="mb-0" style={{ fontFamily: 'Antonio, sans-serif', fontSize: '3rem', fontWeight: '700', color: 'yellow' }}>
          Calendário de Eventos
        </h2>
      </Container>

      <Container className='py-0 mt-3'>
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
        <Form>
          <Row className="mb-4">
            <Col md={6}>
              <Form.Group controlId="formDataEvento">
                <Form.Label>Data do evento:</Form.Label>
                <InputMask
                  mask="99/99/9999"
                  value={novaData}
                  onChange={(e) => setNovaData(e.target.value)}
                >
                  {(inputProps) => (
                    <Form.Control type="text" placeholder="DD/MM/AAAA" {...inputProps} />
                  )}
                </InputMask>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="formTipoEvento">
                <Form.Label>Tipo de evento:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ex: Reunião"
                  value={tipoEvento}
                  onChange={(e) => setTipoEvento(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Button className='mb-4' variant="primary" onClick={handleAddEvento}>
            Adicionar Evento
          </Button>
        </Form>

        <h2 style={{ fontFamily: 'Antonio, sans-serif' }}>Calendário de Eventos</h2>
        <div style={{ maxHeight: '400px', overflowY: 'auto', marginTop: '1rem' }}>
          <Table striped bordered hover>
            <tbody>
              {eventos.map((evento, index) => (
                <tr
                  key={evento.id}
                  style={{ height: '40px', position: 'relative' }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <td style={{ width: '5%', textAlign: 'center' }}>
                    <FaCalendarAlt />
                  </td>
                  <td style={{ width: '95%', position: 'relative' }}>
                    <strong>{evento.data}</strong> - {evento.tipoEvento}
                    {hoveredIndex === index && (
                      <FaTrash
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          cursor: 'pointer',
                          color: 'red'
                        }}
                        title="Excluir evento"
                        onClick={() => handleDeleteEvento(evento.id)}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

      </Container>
    </main>
  );
}

export default CalendarioEventos;
