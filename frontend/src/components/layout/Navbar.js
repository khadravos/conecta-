import React, { useState, useEffect } from "react";  
import { NavLink } from "react-router-dom";
import { FaHome, FaUsers, FaNewspaper, FaSignInAlt, FaTools, FaCalendarAlt, FaDonate, FaUserCircle, FaBook, FaChalkboardTeacher, FaClipboard, FaRegLightbulb  } from "react-icons/fa";
import styles from './Navbar.module.css';
import logo from '../../img/logoGAaj.png';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import axios from "axios";

function BasicExample() {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [matricula, setMatricula] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userMatricula = localStorage.getItem("matricula"); // Assume que a matrícula está armazenada no localStorage

        if (token) {
            setIsLoggedIn(true);  // Usuário está logado
            setMatricula(userMatricula);  // Definir matrícula ao logar
        } else {
            setIsLoggedIn(false); // Usuário não está logado
        }
    }, [localStorage.getItem("token")]);  // Adicionar localStorage.getItem("token") ao array de dependências

    const navigate = useNavigate();

    const [oficinas, setOficinas] = useState([]);

    useEffect(() => {
        // Buscar oficinas do backend
        const fetchOficinas = async () => {
            try {
                const response = await axios.get("http://localhost:8800/oficinas"); // ajuste a URL conforme necessário
                setOficinas(response.data); // Supondo que a resposta seja um array de oficinas
            } catch (error) {
                console.error("Erro ao buscar oficinas:", error);
            }
        };

        fetchOficinas();
    }, []);

    const handleLogout = () => {
        // Remover o token e a matrícula do localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("matricula");
        
        // Redirecionar para a página de login
        setIsLoggedIn(false);
        navigate("/login");
    };

    return (
        <Navbar expand="lg" className={`bg-body-tertiary py-0 ${styles.customNavbar}`}>
            <Container>
                <Navbar.Brand href="#home">
                    <img
                        src={logo}
                        width="150"
                        height="40"
                        className="d-inline-block align-top"
                        alt="React Bootstrap logo"
                    />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="ms-auto">
                        {/* Home */}
                        <NavLink
                            to="/"
                            className={styles.customNav}
                            style={({ isActive }) => ({
                                color: isActive ? "#ad0b0b" : "inherit",
                                textDecoration: isActive ? "underline" : "none",
                                textUnderlineOffset: "4px",
                                textDecorationColor: isActive ? "#ad0b0b" : "transparent",
                            })}
                        >
                            <Nav.Link href="#home">
                                <FaHome style={{ marginRight: "5px" }} /> Home
                            </Nav.Link>
                        </NavLink>

                        {/* Conheça-nos */}
                        <NavLink
                            to="/conheca"
                            className={styles.customNav}
                            style={({ isActive }) => ({
                                color: isActive ? "#ad0b0b" : "inherit",
                                textDecoration: isActive ? "underline" : "none",
                                textUnderlineOffset: "4px",
                                textDecorationColor: isActive ? "#ad0b0b" : "transparent",
                            })}
                        >
                            <Nav.Link href="#conheca">
                                <FaUsers style={{ marginRight: "5px" }} /> Conheça-nos
                            </Nav.Link>
                        </NavLink>

                        {/* Institucional Dropdown */}
                        <NavDropdown
                            title={<span><FaBook style={{ marginRight: "5px" }} /> Institucional</span>}
                            id="collapsible-nav-dropdown"
                        >
                            <NavLink
                                to="/Doacoes"
                                className={styles.customNav}
                                style={({ isActive }) => ({
                                    color: isActive ? "#ad0b0b" : "inherit",
                                    textDecoration: isActive ? "underline" : "none",
                                    textUnderlineOffset: "4px",
                                    textDecorationColor: isActive ? "#ad0b0b" : "transparent",
                                })}
                            >
                                <NavDropdown.Item href="#doacoes">
                                    <FaDonate style={{ marginRight: "5px" }} /> Doações
                                </NavDropdown.Item>
                            </NavLink>
                            <NavDropdown
                                title={<span><FaRegLightbulb style={{ marginRight: "5px" }} /> Oficinas</span>}
                                id="dropdown-oficinas"
                                className={styles.customNav}
                            >
                                {oficinas.length > 0 ? (
                                    oficinas.map((oficina) => (
                                        <NavLink
                                            key={oficina.id}
                                            to={`/oficinas/${oficina.OFC_Id}`}
                                            className={styles.customNav}
                                            style={({ isActive }) => ({
                                                color: isActive ? "#ad0b0b" : "inherit",
                                                textDecoration: isActive ? "underline" : "none",
                                                textUnderlineOffset: "4px",
                                                textDecorationColor: isActive ? "#ad0b0b" : "transparent",
                                            })}
                                        >
                                            <NavDropdown.Item href={`#oficina-${oficina.id}`}>
                                                {oficina.OFC_Nome}
                                            </NavDropdown.Item>
                                        </NavLink>
                                    ))
                                ) : (
                                    <NavDropdown.Item disabled>Nenhuma oficina disponível</NavDropdown.Item>
                                )}
                            </NavDropdown>
                        </NavDropdown>

                        {/* Notícias */}
                        <NavLink
                            to="/noticia"
                            className={styles.customNav}
                            style={({ isActive }) => ({
                                color: isActive ? "#ad0b0b" : "inherit",
                                textDecoration: isActive ? "underline" : "none",
                                textUnderlineOffset: "4px",
                                textDecorationColor: isActive ? "#ad0b0b" : "transparent",
                            })}
                        >
                            <Nav.Link href="#noticias">
                                <FaNewspaper style={{ marginRight: "5px" }} /> Notícias
                            </Nav.Link>
                        </NavLink>

                        {/* Login ou Matrícula */}
                        {!isLoggedIn ? (
                            <NavLink
                                to="/login"
                                className={styles.customNav}
                                style={({ isActive }) => ({
                                    color: isActive ? "#ad0b0b" : "inherit",
                                    textDecoration: isActive ? "underline" : "none",
                                    textUnderlineOffset: "4px",
                                    textDecorationColor: isActive ? "#ad0b0b" : "transparent",
                                })}
                            >
                                <Nav.Link href="#login">
                                    <FaSignInAlt style={{ marginRight: "5px" }} /> Login
                                </Nav.Link>
                            </NavLink>
                        ) : (
                            <>
                                {/* Exibir matrícula */}
                                <NavDropdown
                                    title={<span><FaTools style={{ marginRight: "5px" }} /> Administração {matricula}</span>}
                                    id="matricula-dropdown"
                                    className="customNav"
                                    style={{ color: "#ad0b0b" }}
                                >
                                    {/* Matrículas */}
                            <NavLink
                                to="/matriculas"
                                className={styles.customNav}
                                style={({ isActive }) => ({
                                    color: isActive ? "#ad0b0b" : "inherit",
                                    textDecoration: isActive ? "underline" : "none",
                                    textUnderlineOffset: "4px",
                                    textDecorationColor: isActive ? "#ad0b0b" : "transparent",
                                })}
                            >
                                <NavDropdown.Item href="#matriculas">
                                    <FaClipboard   style={{ marginRight: "5px" }} /> Matrículas
                                </NavDropdown.Item>
                            </NavLink>

                            {/* Oficinas */}
                            <NavLink
                                to="/gerenciarOficinas"
                                className={styles.customNav}
                                style={({ isActive }) => ({
                                    color: isActive ? "#ad0b0b" : "inherit",
                                    textDecoration: isActive ? "underline" : "none",
                                    textUnderlineOffset: "4px",
                                    textDecorationColor: isActive ? "#ad0b0b" : "transparent",
                                })}
                            >
                                <NavDropdown.Item href="#oficinas">
                                    <FaRegLightbulb style={{ marginRight: "5px" }} /> Oficinas
                                </NavDropdown.Item>
                            </NavLink>

                            {/* Professores */}
                            <NavLink
                                to="/professores"
                                className={styles.customNav}
                                style={({ isActive }) => ({
                                    color: isActive ? "#ad0b0b" : "inherit",
                                    textDecoration: isActive ? "underline" : "none",
                                    textUnderlineOffset: "4px",
                                    textDecorationColor: isActive ? "#ad0b0b" : "transparent",
                                })}
                            >
                                <NavDropdown.Item href="#professores">
                                    <FaChalkboardTeacher style={{ marginRight: "5px" }} /> Professores
                                </NavDropdown.Item>
                            </NavLink>

                            {/* Calendário */}
                            <NavLink
                                to="/calendarioEventos"
                                className={styles.customNav}
                                style={({ isActive }) => ({
                                    color: isActive ? "#ad0b0b" : "inherit",
                                    textDecoration: isActive ? "underline" : "none",
                                    textUnderlineOffset: "4px",
                                    textDecorationColor: isActive ? "#ad0b0b" : "transparent",
                                })}
                            >
                                <NavDropdown.Item href="#calendario">
                                    <FaCalendarAlt style={{ marginRight: "5px" }} /> Calendário
                                </NavDropdown.Item>
                            </NavLink>

                            {/* Notícias */}
                            <NavLink
                                to="/gerenciamentoNoticias"
                                className={styles.customNav}
                                style={({ isActive }) => ({
                                    color: isActive ? "#ad0b0b" : "inherit",
                                    textDecoration: isActive ? "underline" : "none",
                                    textUnderlineOffset: "4px",
                                    textDecorationColor: isActive ? "#ad0b0b" : "transparent",
                                })}
                            >
                                <NavDropdown.Item href="#gerenciamentoNoticias">
                                    <FaNewspaper style={{ marginRight: "5px" }} /> Notícias
                                </NavDropdown.Item>
                            </NavLink>

                            <NavDropdown.Divider />

                            {/* Perfil */}
                            <NavLink
                                to="/perfil"
                                className={styles.customNav}
                                style={({ isActive }) => ({
                                    color: isActive ? "#ad0b0b" : "inherit",
                                    textDecoration: isActive ? "underline" : "none",
                                    textUnderlineOffset: "4px",
                                    textDecorationColor: isActive ? "#ad0b0b" : "transparent",
                                })}
                            >
                                <NavDropdown.Item href="#perfil">
                                    <FaUserCircle style={{ marginRight: "5px" }} /> Perfil
                                </NavDropdown.Item>
                            </NavLink>

                                    <NavDropdown.Item href="#sair" onClick={handleLogout}>
                                        <FaSignInAlt style={{ marginRight: "5px" }} /> Sair
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default BasicExample;
