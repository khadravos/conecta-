import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Container, Row, Col } from 'react-bootstrap';
import axios from "axios";
import ImgSobre from '../../img/espanhol.jpg';

function Oficinas() {
  const { id } = useParams();
  const [oficina, setOficina] = useState(null);

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:8800/oficinas/${id}`)
        .then(response => {
          const data = response.data;
  
          // Transformar dia em array (assumindo que vem como string separada por vírgulas)
          const diasArray = data.dia ? data.dia.split(',').map(d => d.trim()) : [];
  
          setOficina({
            ...data,
            dias: diasArray // novo campo no estado
          });
        })
        .catch(error => {
          console.error("Erro ao buscar oficina:", error);
        });
    }
  }, [id]);

  if (!oficina) return <p className="text-center mt-5">Carregando oficina...</p>;
  

  return (
    <main>
      <Container
        fluid
        className="p-0"
        style={{ backgroundColor: '#ad0b0b', color: 'white' }}
      >
        <Row className="m-0 flex-column flex-lg-row" style={{ minHeight: '30vh' }}>
          <Col xs={12} lg={5} className="p-0" style={{ height: '30vh' }}>
            <img
                src={oficina.imagem_main ? `http://localhost:8800/uploads/${oficina.imagem_main}` : ImgSobre}
                alt="Imagem da Oficina"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'left',
                  display: 'block',
                  borderRadius: '0px 0px 200px 0px'
                }}
              />
          </Col>

          <Col xs={12} lg={7} className="d-flex flex-column justify-content-center align-items-center text-center p-4">
            <h2 className="mb-4" style={{ fontFamily: 'Antonio, sans-serif', fontSize: '5rem', fontWeight: '700', color: '#f9c41c' }}>
              {oficina.nome}
            </h2>
            <p className="mb-4" style={{ fontFamily: 'Antonio, sans-serif', fontSize: '1.2rem', fontWeight: '700' }}>
              Prof° {oficina.professor}
            </p>
          </Col>
        </Row>
      </Container>

      <Container className="justify-content-center shadow p-4">
        <Container className="p-2 d-flex justify-content-center"
          style={{
            backgroundColor: '#ad0b0b',
            color: 'white',
            borderRadius: '10px 40px',
            width: '200px',
            marginLeft: '0'
          }}
        >
          <h2 className="my-0" style={{ fontFamily: "'Lora', serif", letterSpacing: "0.01em", fontWeight: "700" }}>
            Sobre:
          </h2>
        </Container>

        <Container>
          <p>{oficina.descricao}</p>
        </Container>

        <Container fluid className="p-0" style={{ backgroundColor: '#ad0b0b', color: 'white' }}>
          <Row className="m-0 flex-column flex-lg-row" style={{ minHeight: '40vh' }}>
            <Col xs={12} lg={7} className="d-flex flex-column justify-content-center align-items-center text-center p-4">
              <h2 style={{ fontFamily: "'Lora', serif", fontWeight: "700" }}>Possui vagas:</h2>
              <h2 style={{ fontFamily: "'Lora', serif", fontWeight: "700" }}>{oficina.vagas ? "Sim" : "Não"}</h2>

              <h2 className="mt-3" style={{ fontFamily: "'Lora', serif", fontWeight: "700" }}>Dias e horários:</h2>
              {oficina.dias && oficina.dias.map((dia, index) => (
                <h4 key={index} style={{ fontFamily: "'Lora', serif", fontWeight: "700" }}>{dia}</h4>
              ))}
              <h4 style={{ fontFamily: "'Lora', serif", fontWeight: "700" }}>
                Das {oficina.hora_inicio?.substring(0, 5)} às {oficina.hora_fim?.substring(0, 5)}
              </h4>

              {oficina.observacao && (
                <h4 className="mt-3" style={{ fontFamily: "'Lora', serif", fontWeight: "700" }}>
                  Observação: {oficina.observacao}
                </h4>
              )}
            </Col>

            <Col xs={12} lg={5} className="p-0" style={{ height: '40vh' }}>
              <img
                src={oficina.imagem_sec ? `http://localhost:8800/uploads/${oficina.imagem_sec}` : ImgSobre}
                alt="Imagem da Oficina"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'left',
                  display: 'block',
                  borderRadius: '100px 0px 0px 100px'
                }}
              />
            </Col>
          </Row>
        </Container>
      </Container>
    </main>
  );
}

export default Oficinas;
