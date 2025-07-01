import { Link, useNavigate } from "react-router-dom";  
import { Container, Row, Col, Button } from 'react-bootstrap'; 
import Form from 'react-bootstrap/Form';
import { FaArrowLeft } from 'react-icons/fa';
import axios from "axios";

import ImgSobre from '../../img/fundo.jpg';

import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom"; 

function CriarOficina() {
  const [isAuthenticated, setIsAuthenticated] = useState(true); 
  const [imagemTopo, setImagemTopo] = useState(ImgSobre);
  const [imagemRodape, setImagemRodape] = useState(ImgSobre);
  const [tituloOficina, setTituloOficina] = useState('');
  const [professores, setProfessores] = useState([]);
  const [professorId, setProfessorId] = useState('');
  const [descricao, setDescricao] = useState('');
  const [vagas, setVagas] = useState(null);
  const [diasSemana, setDiasSemana] = useState([]);
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFim, setHoraFim] = useState('');
  const [arquivoImagemTopo, setArquivoImagemTopo] = useState(null);
  const [arquivoImagemRodape, setArquivoImagemRodape] = useState(null);
  const navigate = useNavigate();
  const [horariosOcupados, setHorariosOcupados] = useState([]);

  useEffect(() => {
    if (professorId) {
      axios.get(`http://localhost:8800/professores/${professorId}/horarios`)
        .then(res => setHorariosOcupados(res.data))
        .catch(err => console.error("Erro ao buscar horários do professor:", err));
    }
  }, [professorId]);

  const horariosConflitantes = () => {
  return horariosOcupados.some((oficina) => {
    const diasOficina = oficina.OFC_Dia?.split(',').map(d => d.trim()) || [];
    const conflitoDeDia = diasSemana.some(dia => diasOficina.includes(dia));

    if (!conflitoDeDia) return false;

    // Comparar horários
    const inicioNovo = horaInicio;
    const fimNovo = horaFim;

    const inicioExistente = oficina.OFC_Hora_Inicio;
    const fimExistente = oficina.OFC_Hora_Fim;

    return (
      inicioNovo < fimExistente && fimNovo > inicioExistente // Sobreposição
    );
  });
  };

  const handleChangeImagemTopo = (event) => {
  const file = event.target.files[0];
  if (file) {
    setArquivoImagemTopo(file);
    setImagemTopo(URL.createObjectURL(file)); // para preview
  }
  };

  const handleChangeImagemRodape = (event) => {
  const file = event.target.files[0];
  if (file) {
    setArquivoImagemRodape(file);
    setImagemRodape(URL.createObjectURL(file));
  }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthenticated(false); 
    }
  }, []);

  useEffect(() => {
  const buscarProfessores = async () => {
    try {
      const response = await fetch('http://localhost:8800/professores');
      const data = await response.json();
      setProfessores(data);
    } catch (error) {
      console.error('[buscarProfessores] Erro ao carregar professores:', error);
    }
  };

  buscarProfessores();
  }, []);

  const enviarOficina = async () => {
  const idProfessor = professorId;
  if (!idProfessor) return;

  if (horariosConflitantes()) {
    alert("Este professor já tem uma oficina cadastrada nesse horário em um dos dias selecionados.");
    return;
  }

  const formData = new FormData();
  formData.append('nome', tituloOficina);
  formData.append('descricao', descricao);
  formData.append('dias', diasSemana.join(','));
  formData.append('horaInicio', horaInicio);
  formData.append('horaFim', horaFim);
  formData.append('vagas', vagas ? 1 : 0);
  formData.append('professor_id', idProfessor);

  if (arquivoImagemTopo) {
    formData.append('imagemMain', arquivoImagemTopo);
  }
  if (arquivoImagemRodape) {
    formData.append('imagemSec', arquivoImagemRodape);
  }

  try {
    const response = await axios.post('http://localhost:8800/oficinas', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (response.status === 200 || response.status === 201) {
      alert('Oficina cadastrada com sucesso!');
      navigate("/gerenciarOficinas");  
    } else {
      alert('Erro ao cadastrar oficina.');
      console.error('Erro:', response.data);
    }
      } catch (error) {
        console.error('[enviarOficina] Erro ao enviar:', error);
      }
    };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <main>

      <Container fluid
        className="p-2"
        style={{ backgroundColor: '#ad0b0b'}}>
              <Link
                to="/gerenciarOficinas"
                style={{
                  textDecoration: 'none',
                  color: 'white',
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

      <Container
        fluid
        className="p-0"
        style={{ backgroundColor: '#ad0b0b', color: 'white' }}
      >
        <Row
          className="m-0 flex-column flex-lg-row"
          style={{ minHeight: '40vh' }}
        >
          {/* Imagem Topo */}
          <Col
            xs={12}
            lg={5}
            className="p-0"
            style={{ height: '40vh', position: 'relative' }}
          >
            <div style={{ height: '100%', width: '100%' }}>
              <img
                src={imagemTopo}
                alt="Imagem Topo"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'left',
                  display: 'block',
                  borderRadius: '0px 0px 200px 0px'
                }}
              />
              <Button
                as="label"
                htmlFor="upload-topo"
                style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  zIndex: 2,
                  fontWeight: '700',
                  backgroundColor: '#ad0b0b',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Editar Imagem
              </Button>
              <input
                id="upload-topo"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleChangeImagemTopo}
              />
            </div>
          </Col>

          {/* Texto */}
          <Col
            xs={12}
            lg={7}
            className="d-flex flex-column justify-content-center align-items-center text-center p-4"
            style={{ height: 'auto' }}
          >
            <Form>
              <Form.Group className="mb-3">
                <Form.Label style={{fontFamily: 'Antonio, sans-serif', fontSize: '1.2rem' }}>Adicione o nome da oficina</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Oficina"
                  value={tituloOficina}
                  onChange={(e) => setTituloOficina(e.target.value)}
                  style={{
                  fontFamily: 'Antonio, sans-serif',
                  fontSize: '4rem',
                  fontWeight: '700',
                  color: '#f9c41c',
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                  border: 'none'
                 }}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label style={{ fontFamily: 'Antonio, sans-serif', fontSize: '1.2rem' }}>Selecione o professor</Form.Label>
                <Form.Select
                  value={professorId}
                  onChange={(e) => setProfessorId(e.target.value)}
                  style={{
                    fontFamily: 'Antonio, sans-serif',
                    fontSize: '1.2rem',
                    fontWeight: '700',
                    color: 'black',
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    border: 'none'
                  }}
                >
                  <option value="">Selecione um professor</option>
                  {professores.map((prof) => (
                    <option key={prof.PRO_Id} value={prof.PRO_Id}>
                      {prof.PRO_Nome}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Form>
          </Col>
        </Row>
      </Container>


      <Container className="justify-content-center shadow p-4">
        {/* Card alinhado à esquerda */}
        <Container
          className="p-2 d-flex justify-content-center"
          style={{
            backgroundColor: '#ad0b0b',
            color: 'white',
            borderRadius: '10px 40px',
            width: '200px',  // Ajuste a largura conforme necessário
            marginLeft: '0'   // Garante que o card fique alinhado à esquerda
          }}
        >
          <h2
            className="my-0"
            style={{
              fontFamily: "'Lora', serif",
              letterSpacing: "0.01em",
              fontWeight: "700"
            }}
          >
            Sobre:
          </h2>
        </Container>

        <Container>
          <Form>
          <Form.Group controlId="descricao-oficina" className="mt-3">
            <Form.Label>Descrição</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Digite uma descrição para a oficina"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                border: 'none',
                color: 'black'
              }}
            />
          </Form.Group>
          </Form>
        </Container>

        <Container
          fluid
          className="p-0"
          style={{ backgroundColor: '#ad0b0b', color: 'white', Height: '55vh' }}
        >
          <Row
            className="m-0 flex-column flex-lg-row"
            style={{ minHeight: '55vh' }}
          >
            {/* Texto */}

            <Col
              xs={12}
              lg={7}
              className="d-flex flex-column  justify-content-center align-items-stretch text-center p-4"
              style={{ height: 'auto' }}
            >
              <h2 className="text-center" style={{ fontFamily: "'Lora', serif", letterSpacing: "0.01em", fontWeight: "700" }}>Possui vagas:</h2> 
              
              <Form>
                <div className="mb-3">
                <Form.Check
                  inline
                  type="radio"
                  id="resposta-sim"
                  name="resposta"
                  label="Sim"
                  checked={vagas === true}
                  onChange={() => setVagas(true)}
                />
                <Form.Check
                  inline
                  type="radio"
                  id="resposta-nao"
                  name="resposta"
                  label="Não"
                  checked={vagas === false}
                  onChange={() => setVagas(false)}
                />
                </div>
              </Form>

              <Form>

                <h2 className="text-center mt-0" style={{ fontFamily: "'Lora', serif", letterSpacing: "0.01em", fontWeight: "700" }}>Selecione os dias da semana:</h2>

                <Form.Group className="mb-3">
                  <div className="d-flex gap-3 justify-content-center">
                  {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'].map((dia) => (
                    <Form.Check
                      key={dia}
                      type="checkbox"
                      id={`dia-${dia}`}
                      label={dia}
                      name="diasSemana"
                      checked={diasSemana.includes(dia)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setDiasSemana([...diasSemana, dia]);
                        } else {
                          setDiasSemana(diasSemana.filter(d => d !== dia));
                        }
                      }}
                    />
                  ))}
                  </div>
                </Form.Group>

                <h2 className="text-center mt-0" style={{ fontFamily: "'Lora', serif", letterSpacing: "0.01em", fontWeight: "700" }}>Horário disponível:</h2>

                <Form.Group className="mb-3">
                  <div className="d-flex align-items-center gap-3">
                  <Form.Control
                      className="text-center"
                      style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', border: 'none', color: 'white' }}
                      type="time"
                      id="hora-inicio"
                      value={horaInicio}
                      onChange={(e) => setHoraInicio(e.target.value)}
                    />
                    <span>até</span>
                    <Form.Control
                      className="text-center"
                      style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', border: 'none', color: 'white' }}
                      type="time"
                      id="hora-fim"
                      value={horaFim}
                      onChange={(e) => setHoraFim(e.target.value)}
                    />
                  </div>
                </Form.Group>
              </Form>
            </Col>

            {/* Imagem */}

            <Col
            xs={12}
            lg={5}
            className="p-0"
            style={{ height: '55vh', position: 'relative' }}
          >
            <div style={{ height: '100%', width: '100%' }}>
              <img
                src={imagemRodape}
                alt="Imagem Rodapé"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'left',
                  display: 'block',
                  borderRadius: '100px 0px 0px 100px'
                }}
              />
              <Button
                as="label"
                htmlFor="upload-rodape"
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '10px',
                  zIndex: 2,
                  fontWeight: '700',
                  backgroundColor: '#ad0b0b',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Editar Imagem
              </Button>
              <input
                id="upload-rodape"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleChangeImagemRodape}
              />
            </div>
          </Col>

          </Row>
        </Container>
      
      
        <Container className="text-center mt-4">
          <Button
            variant="danger"
            onClick={enviarOficina}
            style={{ fontWeight: '700', fontSize: '1.2rem' }}
          >
            Salvar Oficina
          </Button>
        </Container>
      </Container>

    </main>
  );
}

export default CriarOficina;
