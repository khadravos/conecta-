import { Link, useParams, Navigate, useNavigate } from "react-router-dom";  
import { Container, Row, Col, Button, Form } from 'react-bootstrap'; 
import React, { useEffect, useState } from "react";
import { FaArrowLeft } from 'react-icons/fa';
import ImgSobre from '../../img/fundo.jpg';

function EditarOficina() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(true); 
  const [imagemTopo, setImagemTopo] = useState(ImgSobre);
  const [imagemRodape, setImagemRodape] = useState(ImgSobre);
  const [tituloOficina, setTituloOficina] = useState('');
  const [professorId, setProfessorId] = useState('');
  const [descricao, setDescricao] = useState('');
  const [vagas, setVagas] = useState(null);
  const [diasSemana, setDiasSemana] = useState([]);
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFim, setHoraFim] = useState('');
  const [professores, setProfessores] = useState([]);
  const diasSemanaString = diasSemana.join(',');
  const [imagemTopoFile, setImagemTopoFile] = useState(null);
  const [imagemRodapeFile, setImagemRodapeFile] = useState(null);
  const [imagemTopoPreview, setImagemTopoPreview] = useState(null);
  const [imagemRodapePreview, setImagemRodapePreview] = useState(null);


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) setIsAuthenticated(false);
  }, []);

  const handleChangeImagemTopo = (event) => {
  const file = event.target.files[0];
  if (file) {
    setImagemTopoFile(file);
    setImagemTopoPreview(URL.createObjectURL(file));
  }
  };

  const handleChangeImagemRodape = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImagemRodapeFile(file);
      setImagemRodapePreview(URL.createObjectURL(file));
    }
  };

 useEffect(() => {
  const carregarDados = async () => {
    try {
      // Carregar professores primeiro
      const responseProf = await fetch('http://localhost:8800/professores');
      const dataProf = await responseProf.json();
      setProfessores(dataProf);

      // Carregar oficina
      const responseOfi = await fetch(`http://localhost:8800/oficinas/${id}`);
      const dataOfi = await responseOfi.json();

      setTituloOficina(dataOfi.nome || '');
      setDescricao(dataOfi.descricao || '');
      setDiasSemana(dataOfi.dia ? dataOfi.dia.split(',').map(d => d.trim().toLowerCase()) : []);
      setHoraInicio(dataOfi.hora_inicio?.slice(0, 5) || '');
      setHoraFim(dataOfi.hora_fim?.slice(0, 5) || '');
      setVagas(Boolean(dataOfi.vagas));

      // Setar imagens, assumindo que a API retorna os campos assim:
      setImagemTopo(dataOfi.imagem_main || '');
      setImagemRodape(dataOfi.imagem_sec || '');

      if (dataOfi.professorId) {
        setProfessorId(String(dataOfi.professorId));
      } else if (dataOfi.professor && dataProf.length > 0) {
        const prof = dataProf.find(p => p.PRO_Nome === dataOfi.professor);
        if (prof) setProfessorId(String(prof.PRO_Id));
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  carregarDados();
}, [id]);

  const atualizarOficina = async () => {
  if (!professorId) {
    alert("Selecione um professor.");
    return;
  }

  const formData = new FormData();
  formData.append('nome', tituloOficina);
  formData.append('descricao', descricao);
  formData.append('dia', diasSemana.join(','));
  formData.append('horaInicio', horaInicio);
  formData.append('horaFim', horaFim);
  formData.append('vagas', vagas ? 1 : 0);
  formData.append('professorId', professorId);

  // Se você tiver inputs de arquivo, por exemplo:
  if (imagemTopoFile) {  // imagemTopoFile é um File selecionado em input
    formData.append('imagemMain', imagemTopoFile);
  }

  if (imagemRodapeFile) {  // imagemRodapeFile é um File selecionado em input
    formData.append('imagemSec', imagemRodapeFile);
  }

  try {
    const response = await fetch(`http://localhost:8800/oficinas/${id}`, {
      method: 'PUT',
      // Não setar Content-Type para deixar o browser definir automaticamente o multipart/form-data
      body: formData,
    });

    if (response.ok) {
      alert("Oficina atualizada com sucesso!");
      navigate('/gerenciaroficinas');
    } else {
      const msg = await response.text();
      alert("Erro ao atualizar oficina: " + msg);
    }
  } catch (error) {
    console.error("Erro ao atualizar:", error);
  }
};

  if (!isAuthenticated) return <Navigate to="/login" />;

  // O resto do JSX continua igual ao CriarOficina, apenas troque o botão final:
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
                      src={imagemTopoPreview || `http://localhost:8800/uploads/${imagemTopo}`} 
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
                      <Form.Label style={{fontFamily: 'Antonio, sans-serif', fontSize: '1.2rem' }}>Selecione o professor</Form.Label>
                      <Form.Select
                        value={professorId}
                        onChange={(e) => setProfessorId(e.target.value)}
                        style={{
                          fontFamily: 'Antonio, sans-serif',
                          fontSize: '1.2rem',
                          fontWeight: '700',
                          color: 'white',
                          backgroundColor: 'rgba(0, 0, 0, 0.2)',
                          border: 'none'
                        }}
                      >
                        <option value="">-- Selecione um professor --</option>
                        {professores.map(prof => (
                            <option key={prof.PRO_Id} value={String(prof.PRO_Id)}>
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
                      color: 'white'
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
                        id="vagas-sim"
                        label="Sim"
                        name="vagas"
                        checked={vagas === true}
                        onChange={() => setVagas(true)}
                      />
                      <Form.Check
                        inline
                        type="radio"
                        id="vagas-nao"
                        label="Não"
                        name="vagas"
                        checked={vagas === false}
                        onChange={() => setVagas(false)}
                      />
                      </div>
                    </Form>
      
                    <Form>
      
                      <h2 className="text-center mt-0" style={{ fontFamily: "'Lora', serif", letterSpacing: "0.01em", fontWeight: "700" }}>Selecione os dias da semana:</h2>
      
                      <Form.Group className="mb-3">
                        <div className="d-flex gap-3 justify-content-center">
                        {['segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'].map((dia) => (
                            <Form.Check
                              key={dia}
                              type="checkbox"
                              id={`dia-${dia}`}
                              label={dia.charAt(0).toUpperCase() + dia.slice(1)}
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
                    <Form>
                      <Form.Group className="mb-3 w-100" controlId="exampleForm.ControlTextarea1">
                        <h2 className="text-center mt-3" style={{ fontFamily: "'Lora', serif", letterSpacing: "0.01em", fontWeight: "700" }}>Descrição:</h2>
                        <Form.Control
                          as="textarea"
                          placeholder="Escreva uma pequena descrição sobre o curso..."
                          rows={2}
                          className="w-100" 
                          style={{
                            backgroundColor: 'rgba(0, 0, 0, 0.2)',
                            border: 'none'
                          }}
                        />
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
                      src={imagemRodapePreview || `http://localhost:8800/uploads/${imagemRodape}`}
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
                  variant="warning"
                  onClick={atualizarOficina}
                  style={{ fontWeight: '700', fontSize: '1.2rem' }}
                >
                  Atualizar Oficina
                </Button>
              </Container>
            </Container>
    </main>
  );
}

export default EditarOficina;
