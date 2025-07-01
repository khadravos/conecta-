import { Link, Navigate } from "react-router-dom"; 
import { Container, Row, Col, Button, InputGroup } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { FaSearch, FaPlus } from "react-icons/fa";
import Card from 'react-bootstrap/Card';
import { useEffect, useState } from "react";
import axios from "axios";

import espanhol from '../../img/oficina.png'

function GerenciarOficinas() {

  const [busca, setBusca] = useState("");
  const [oficinas, setOficinas] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8800/oficinas")
      .then(response => {
        setOficinas(response.data);
      })
      .catch(error => {
        console.error("Erro ao buscar oficinas:", error);
      });
  }, []);

  const oficinasFiltradas = oficinas.filter(oficina =>
    oficina.OFC_Nome.toLowerCase().includes(busca.toLowerCase()) ||
    oficina.OFC_Descricao.toLowerCase().includes(busca.toLowerCase())
  );

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
    <main className="container shadow p-4">

            <Container
                fluid
                className="d-flex align-items-center justify-content-center"
                style={{ backgroundColor: '#ad0b0b', color: 'white', height: '15vh' }}
            >
                <h2
                    className="mb-0"
                    style={{
                    fontFamily: 'Antonio, sans-serif',
                    fontSize: '3rem',
                    fontWeight: '700',
                    color: 'yellow',
                    }}
                >
                    Oficinas
                </h2>
            </Container>

      <Container>
        <Row className="justify-content-center py-4">
          <Col className="col-md-6">
            <InputGroup>
            <Form.Control
                size="lg"
                type="text"
                placeholder="Insira algum dado da oficina"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
              <InputGroup.Text>
                <FaSearch style={{ color: "#ad0b0b" }} />
              </InputGroup.Text>
            </InputGroup>
          </Col>

          <Col className="col-md-2">
            <Link to="/criarOficina" title="Nova Oficina">
              <Button
                size="lg"
                style={{ backgroundColor: "#ad0b0b", border: "none"}}
              >
                <FaPlus size={22}/>
              </Button>
            </Link>
          </Col>
        </Row>
      </Container>

      <Container className="align-items-center justify-content-center">

        <Row sm={1} md={2} lg={3} xl={4} className="justify-content-between">
          
        {oficinasFiltradas.map((oficina) => (
          <Col key={oficina.OFC_Id} className="mb-4 d-flex justify-content-center">
            <Link to={`/EditarOficinas/${oficina.OFC_Id}`} style={{ textDecoration: "none" }}>
              <Card style={{ width: '16rem', backgroundColor: '#ad0b0b', color: 'white', borderRadius: "10px" }}>
                <Card.Body>
                  <Card.Title className='mb-1 text-center' style={{
                    fontFamily: "'Archivo Black', sans-serif",
                    fontSize: "1.8rem"
                  }}>
                    {oficina.OFC_Nome}
                  </Card.Title>
                </Card.Body>
                <Card.Img
                  variant="top"
                  src={oficina.OFC_Imagem_Main ? `http://localhost:8800/uploads/${oficina.OFC_Imagem_Main}` : espanhol}
                  height={150}
                  width={50}
                  style={{ borderRadius: "50px 50px 10px 10px" }}
                />
              </Card>
            </Link>
          </Col>
        ))}
        </Row>

        

      </Container>



    </main>
  );
}

export default GerenciarOficinas;
