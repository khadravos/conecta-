import "./App.css";  // Importação global do CSS
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Home from './components/pages/Home';
import Conheca from './components/pages/Conheca';
import Institucional from './components/pages/Institucional';
import Noticia from './components/pages/Noticia';
import Matriculas from './components/pages/Matriculas';
import Oficinas from './components/pages/Oficinas';
import GerenciamentoNoticias from './components/pages/GerenciamentoNoticias';
import Perfil from './components/pages/Perfil';
import CriarMatricula from './components/pages/CriarMatricula';
import Doacoes from './components/pages/Doacoes';
import CriarOficina from './components/pages/CriarOficina';
import CriarNoticias from './components/pages/CriarNoticias';
import EditarOficinas from './components/pages/EditarOficinas';
import GerenciarOficinas from './components/pages/GerenciarOficinas';
import Login from './components/pages/Login';
import EditarMatricula from './components/pages/EditarMatricula';
import Professores from './components/pages/Professores';
import CadastrarProfessor from './components/pages/CadastrarProfessor';
import EditarProfessor from './components/pages/EditarProfessor'; // Nova página para editar
import CalendarioEventos from './components/pages/CalendarioEventos';
import EditarNoticias from './components/pages/EditarNoticias';


import Container from "./components/layout/Container";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>

      <Header />

      <Navbar />

      <Container customClass="min-height">

        <Routes>
          
            <Route path="/" element={<Home />} />
            <Route path="/conheca" element={<Conheca />} />
            <Route path="/institucional" element={<Institucional />} />
            <Route path="/noticia" element={<Noticia />} />
            <Route path="/matriculas" element={<Matriculas />} />
            <Route path="/oficinas/:id" element={<Oficinas />} />
            <Route path="/gerenciamentoNoticias" element={<GerenciamentoNoticias />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/criarMatricula" element={<CriarMatricula />} />
            <Route path="/criarNoticias" element={<CriarNoticias/>} />
            <Route path="/doacoes" element={<Doacoes />} />
            <Route path="/criarOficina" element={<CriarOficina />} />
            <Route path="/editarOficinas/:id" element={<EditarOficinas />} />
            <Route path="/gerenciarOficinas" element={<GerenciarOficinas />} />
            <Route path="/professores" element={<Professores/>} />
            <Route path="/cadastrarProfessor" element={<CadastrarProfessor/>} />
            <Route path="/editarProfessor/:professorId" element={<EditarProfessor />} />
            <Route path="/login" element={<Login />} />
            <Route path="/editarMatricula/:alunoId" element={<EditarMatricula />} />
            <Route path="/calendarioEventos" element={<CalendarioEventos />} />
            <Route path="/editarNoticias/:id" element={<EditarNoticias />} />
            
            
          
        </Routes>
      </Container>

      <Footer />

    </Router>
  );
}

export default App;
