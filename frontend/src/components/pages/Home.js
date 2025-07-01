import style from './Home.css'
import { Link } from "react-router-dom"; 

import {FaPhoneAlt, FaEnvelope, FaMapMarkedAlt} from 'react-icons/fa'

import { Container, Row, Col, Button } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';

import ImgSobre from '../../img/Gaaj_Sobre.jpg'

import { useState, useEffect } from 'react';
import axios from 'axios';




function Home() {

  const [oficinas, setOficinas] = useState([]);

  useEffect(() => {
  axios.get('http://localhost:8800/oficinas') // Altere a URL conforme sua API
    .then(response => {
      setOficinas(response.data);
    })
    .catch(error => {
      console.error('Erro ao buscar oficinas:', error);
    });
  }, []);

  return (
    <main className="main">

      <Container fluid className="d-flex align-items-center justify-content-center" style={{backgroundColor: '#ad0b0b', color: 'white'}}>
        <Row className="d-flex align-items-center justify-content-center">
          {/* Texto */}
          <Col xs={12} md={5} className="col-texto-sobre text-center">
            <h2 className='mb-4' style={{ fontFamily: 'Antonio, sans-serif', fontSize: '2.7rem', fontWeight: '700', color: "#ffdf2b" }} >Sobre Nós</h2>
            <p className='mb-4' style={{ fontFamily: "'Lora', serif", fontSize: '1.2rem', fontWeight: "300" }}>
              O Grupo de Apoio e Amparo à Juventude – GAAJ – é uma entidade filantrópica e parceira, sem fins lucrativos,
              mantida por doações oriundas de ações monetárias e parcerias da comunidade local, que atende gratuitamente
              crianças e adolescentes em situação de vulnerabilidade social, de 05 a 17 anos, no contra turno escolar.
            </p>
            <Link to="/conheca"><Button href="#conheca" variant="primary" className="btn-conheca-nos" style={{ fontFamily: 'Antonio, sans-serif', fontSize: '1.2rem', fontWeight: '500' }} >
              Conheça-nos
            </Button></Link>
          </Col>

          {/* Imagem */}
          <Col xs={12} md={12} lg={6} className="d-flex align-items-center justify-content-center">
            <img src={ImgSobre} alt="Logo" className="img-fluid" style={{ maxWidth: "550px" }} />
          </Col>
        </Row>
      </Container>

      <header className="container shadow p-4 bg-white rounded">

 
        {/*     Card      */}


        <Container className="align-items-center justify-content-center">

          <h1 className="text-center mb-5" style={{ fontFamily: "'Lora', serif", letterSpacing: "0.01em", fontWeight: "700" }}>Oficinas</h1>

          <Row sm={1} md={2} lg={3} xl={4} className="justify-content-between">
              {oficinas.map((oficina, index) => (
                <Col key={index} className="mb-4 d-flex justify-content-center">
                  <Card className="custom-card" style={{ width: '16rem', border: '2px solid #ad0b0b' }}>
                    <Link
                      to={`/oficinas/${oficina.OFC_Id}`}
                      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                    >
                    <Card.Body>
                      <Card.Title className='mb-2 text-start card-title' style={{ fontFamily: "'Archivo Black', sans-serif", color: "#ad0b0b" }}>
                        {oficina.OFC_Nome}
                      </Card.Title>
                      <Card.Text
                        className="m-0 text-start"
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'normal',
                          height: '4.5em', // ajuste conforme tamanho da fonte e line-height
                          lineHeight: '1.5em',
                        }}
                      >
                        {oficina.OFC_Descricao}
                      </Card.Text>
                    </Card.Body>
                    {oficina.OFC_Imagem_Main && (
                      <Card.Img
                        variant="top"
                        src={`http://localhost:8800/uploads/${oficina.OFC_Imagem_Main}`} // ajuste o caminho conforme seu backend
                        height={200}
                        style={{ borderRadius: '0px 100px 4px 4px', objectFit: 'cover' }}
                      />
                    )}
                    </Link>
                  </Card>
                </Col>
              ))}
            </Row>
        </Container>


        {/*     Localização      */}

        <Container fluid style={{ backgroundColor: '#ededed'}}>
          <Row className="align-items-center py-2">
            
            {/* Mapa */}

            <Col xs={12} md={6} className="text-center">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3675.3763520001107!2d-45.30845942547035!3d-22.899485379260216!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cce7fbca7af4b7%3A0xb41b653954a14492!2sGAAJ%20Roseira!5e0!3m2!1spt-BR!2sbr!4v1732044049339!5m2!1spt-BR!2sbr" 
                style={{ width: '100%', height: '350px', border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </Col>

            {/* Texto */}

            <Col xs={12} md={6}>
              <h2 className="mt-4 mb-2" style={{ fontFamily: "'Lora', serif", letterSpacing: "0.01em", fontWeight: "700" }}>
              <FaMapMarkedAlt style={{ color: 'red', display: 'inline', fontSize: '1.6rem', marginRight: '10px'}}/>
                Endereço:
              </h2>
              <p className='fw-bold'>Major Vitoriano, 102, Roseira-SP, 12580-021</p>
              <p>
                <span className="text-danger fw-bold">Complemento:</span>{' '}
                <span className='fw-bold'>Próximo a Pousada Santanna</span>
              </p>

              <h2 className="mt-2 mb-2" style={{ fontFamily: "'Lora', serif", letterSpacing: "0.01em", fontWeight: "700" }}>
                <FaEnvelope style={{ color: 'red', display: 'inline', fontSize: '1.6rem', marginRight: '10px'}}/>
                E-mail:
              </h2>
              <p className='fw-bold'>contato@gaajsp.org.br</p>

              <h2 className="mt-2 mb-2" style={{ fontFamily: "'Lora', serif", letterSpacing: "0.01em", fontWeight: "700" }}>
                <FaPhoneAlt style={{ color: 'red', display: 'inline', fontSize: '1.6rem', marginRight: '10px'}}/>
                Telefone:
              </h2>
              <p className='fw-bold'>+55 12 3646-2312</p>
            </Col>
          </Row>
        </Container>

      </header>

    </main>

  );

}

export default Home;