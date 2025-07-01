import React, {  useEffect,  useState } from "react";
import {Navigate , useNavigate} from "react-router-dom"; 
import axios from "axios";
import { Container, Row, Col, Button, Table, InputGroup } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import InputMask from 'react-input-mask';
import InputGroupText from "react-bootstrap/esm/InputGroupText";
import { FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;

  return resto === parseInt(cpf.charAt(10));
}

function CriarMatricula() {

    const [confirmadoResponsavel, setConfirmadoResponsavel] = useState(false);
    const [idade, setIdade] = useState('');
    const [serie, setSerie] = useState("");
    const [contatos, setContatos] = useState([
        { numero: '', tipo: '', dono: '' }, // Linha inicial
    ]);

    const [selectedOficinas, setSelectedOficinas] = useState([]);


    
    const navigate = useNavigate();
   
    const calcularIdade = (dataNascimento) => {
    const hoje = new Date();
    const [dia, mes, ano] = dataNascimento.split('/');
    const nascimento = new Date(`${ano}-${mes}-${dia}`);

    let idadeCalculada = hoje.getFullYear() - nascimento.getFullYear();
    const mesAtual = hoje.getMonth() + 1;
    const diaAtual = hoje.getDate();

    if (
        mesAtual < parseInt(mes) ||
        (mesAtual === parseInt(mes) && diaAtual < parseInt(dia))
    ) {
        idadeCalculada--;
    }

    if (idadeCalculada < 6 || idadeCalculada > 17) {
        alert("A idade deve estar entre 6 e 17 anos.");
        
        // Limpa o campo de data e a idade
        setDados(prev => ({
            ...prev,
            aluno: {
                ...prev.aluno,
                dataNascimento: ''
            }
        }));
        setIdade('');
        return;
    }

    setIdade(idadeCalculada);
    };

    const [oficinasDisponiveis, setOficinasDisponiveis] = useState([]);

    useEffect(() => {
      const fetchOficinas = async () => {
        try {
          const response = await axios.get("http://localhost:8800/oficinas"); // URL da sua API
          setOficinasDisponiveis(response.data);
        } catch (error) {
          console.error("Erro ao buscar oficinas:", error);
        }
      };

      fetchOficinas();
    }, []);


    

    const handleChange = (e) => {
        const value = e.target.value.replace(/\D/g, ""); // Remove qualquer caractere não numérico
        setSerie(value ? `${value}º ano` : ""); // Adiciona o sufixo "º ano" apenas se houver número
      };
      
      const handledados = (e) => {
        const { name, value } = e.target;
        setDados(prevDados => ({
          ...prevDados,
          aluno: {
            ...prevDados.aluno,
            [name]: value,
          }
        }));
      };
      
      const handledadosninhados = (e) => {
        const { name, value } = e.target;
        const keys = name.split('.');
      
        setDados(prevDados => {
          const newDados = structuredClone(prevDados); // Clona todo o estado
          let temp = newDados;
          for (let i = 0; i < keys.length - 1; i++) {
            if (!temp[keys[i]]) temp[keys[i]] = {}; // Garante que o objeto existe
            temp = temp[keys[i]];
          }
          temp[keys[keys.length - 1]] = value;
          return newDados;
        });
      };

      const oficinaTemConflito = (oficinaAtual) => {
        // Se a oficina atual já está selecionada, ela não deve ser desabilitada
        if (selectedOficinas.includes(oficinaAtual.OFC_Nome)) return false;

        return selectedOficinas.some((nomeSelecionado) => {
          const oficinaSelecionada = oficinasDisponiveis.find(o => o.OFC_Nome === nomeSelecionado);

          if (!oficinaSelecionada || !oficinaSelecionada.OFC_Dia) return false;

          const dias1 = oficinaAtual.OFC_Dia?.split(',').map(d => d.trim());
          const dias2 = oficinaSelecionada.OFC_Dia?.split(',').map(d => d.trim());

          const temDiaComum = dias1?.some(d => dias2.includes(d));
          if (!temDiaComum) return false;

          return (
            oficinaAtual.OFC_Hora_inicio < oficinaSelecionada.OFC_Hora_fim &&
            oficinaAtual.OFC_Hora_fim > oficinaSelecionada.OFC_Hora_inicio
          );
        });
      };

      // Adicionar nova linha na tabela de contatos
      const adicionarContato = () => {
        const novosContatos = [...contatos, { numero: '', tipo: '', dono: '' }];
        setContatos(novosContatos);
        sincronizarContatos(novosContatos);  // Sincroniza com dados.aluno.contatos
      };


       // Função para lidar com a mudança nos checkboxes de "oficinas"
       const handleOficinaChange = (event) => {
        const { value, checked } = event.target;
        if (checked) {
          // Adiciona a oficina ao array
          setSelectedOficinas([...selectedOficinas, value]);
        } else {
          // Remove a oficina do array
          setSelectedOficinas(selectedOficinas.filter((oficina) => oficina !== value));
        }
      };

      const atualizarContato = (index, campo, valor) => {
        const novosContatos = [...contatos];
        novosContatos[index][campo] = valor;
        setContatos(novosContatos);
        sincronizarContatos(novosContatos);  // Sincroniza com dados.aluno.contatos
      };
      
      const removerContato = (index) => {
        const novosContatos = contatos.filter((_, i) => i !== index);
        setContatos(novosContatos);
        sincronizarContatos(novosContatos);  // Sincroniza com dados.aluno.contatos
      };
      
      const sincronizarContatos = (novosContatos) => {
        setDados((prevDados) => ({
          ...prevDados,
          aluno: {
            ...prevDados.aluno,
            contatos: novosContatos, // Atualiza a propriedade contatos do aluno
          },
        }));
      };

      async function buscaEnderecoPorCEP(cep) {
    // Retira qualquer caractere não numérico
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();

      if (data.erro) {
        alert('CEP não encontrado');
        return;
      }

      // Atualiza os campos de endereço
      setDados(prevDados => ({
        ...prevDados,
        aluno: {
          ...prevDados.aluno,
          responsavel: {
            ...prevDados.aluno.responsavel,
            rua: data.logradouro || '',
            bairro: data.bairro || '',
            cidade: data.localidade || '',
            estado: data.uf || '',
            cep: cepLimpo,
          }
        }
      }));
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    }
  }
      
      const [dados, setDados] = useState({
        aluno: {
          nomeCompleto: "",
          cpf: "",
          dataNascimento: "",
          raca: "",
          sexo: "",
          serie: "",
          turno: "",
          deficiencia: "",
          medicamento: "",
          alergia: "",
          responsavel: {
            nomeCompleto: "",
            cpf: "",
            dataNascimento: "12/12/2012",
            cep: "",
            cidade: "",
            rua: "",
            numero: "",
            bairro: "",
            complemento: "",
            beneficios: "",
          },
          escola: {
            nome: "",
            cep: "99999-999",
            rua: "aaaa",
            numero: "12121",
            bairro: "aaaaa",
            complemento: "aaaa",
            contato: "aaaa",
          },
          contatos: [
            {
            tipo: "",
            numero: "",
            dono: "",
            },
          ],
        },
      });
        const [loading, setLoading] = useState(false);
        const [cpfInvalido, setCpfInvalido] = useState(false);

        const [loadingRes, setLoadingRes] = useState(false);
        const [cpfInvalidoRes, setCpfInvalidoRes] = useState(false);
      
      const removeMask = (value) => value.replace(/\D/g, "");
      
      const validarDadosResponsavel = (responsavelData) => {
        if (!responsavelData.cpf || !responsavelData.nomeCompleto || !responsavelData.dataNascimento) {
          alert("Campos obrigatórios do responsável estão faltando.");
          return "Campos obrigatórios do responsável estão faltando.";
        }
        return null;
      };
      
      const validarDadosEscola = (escolaData) => {
        if (!escolaData.nome || !escolaData.cep || !escolaData.rua || !escolaData.numero) {
          alert("Campos obrigatórios da escola estão faltando.");
          return "Campos obrigatórios da escola estão faltando.";
        }
        return null;
      };
      
      const validarDadosAluno = (alunoData) => {
        if (!alunoData.cpf || !alunoData.nomeCompleto || !alunoData.dataNascimento) {
          alert("Campos obrigatórios do aluno estão faltando.");
          return "Campos obrigatórios do aluno estão faltando.";
        }
        return null;
      };
      
      const validarContatos = (contatos) => {
        if (!Array.isArray(contatos) || contatos.length === 0) {
          alert("É necessário fornecer ao menos um contato.");
          return "É necessário fornecer ao menos um contato.";
        }
        for (let contato of contatos) {
          if (!contato.tipo || !contato.numero || !contato.dono) {
            alert(`Dados faltando no contato: ${JSON.stringify(contato)}`);
            return `Dados faltando no contato: ${JSON.stringify(contato)}`;
          }
        }
        return null;
      };

      const getOficinaIdByName = (nome) => {
      const oficina = oficinasDisponiveis.find(o => o.OFC_Nome === nome);
      return oficina ? oficina.OFC_Id : null;
      };

       

      
      const finalizarInscricao = async () => {
        const cpfValido = validarCPF(dados.aluno.cpf);
        const cpfValidoRes = validarCPF(dados.aluno.responsavel.cpf);

    if (!cpfValido) {
      setCpfInvalido(true);
      setLoading(false);
      return;
    }
    if (!cpfValidoRes) {
      setCpfInvalidoRes(true);
      setLoadingRes(false);
      return;
    }
        try {
          // Validar dados do responsável
          const responsavelValidationError = validarDadosResponsavel(dados.aluno.responsavel);
          if (responsavelValidationError) {
            return console.error(responsavelValidationError);
          }
      
          // Validar dados da escola
          const escolaValidationError = validarDadosEscola(dados.aluno.escola);
          if (escolaValidationError) {
            return console.error(escolaValidationError);
          }
      
          // Validar dados do aluno
          const alunoValidationError = validarDadosAluno(dados.aluno);
          if (alunoValidationError) {
            return console.error(alunoValidationError);
          }
      
          // Validar contatos
          const contatosValidationError = validarContatos(dados.aluno.contatos);
          if (contatosValidationError) {
            return console.error(contatosValidationError);
          }
      
          // Dados do responsável
          const responsavelData = {
            cpf: removeMask(dados.aluno.responsavel.cpf),
            nomeCompleto: dados.aluno.responsavel.nomeCompleto,
            dataNascimento: new Date(dados.aluno.responsavel.dataNascimento).toISOString().split("T")[0],
            cep: removeMask(dados.aluno.responsavel.cep),
            cidade: dados.aluno.responsavel.cidade,
            rua: dados.aluno.responsavel.rua,
            numero: dados.aluno.responsavel.numero,
            bairro: dados.aluno.responsavel.bairro,
            complemento: dados.aluno.responsavel.complemento,
            beneficios: dados.aluno.responsavel.beneficios,
          };
      
          // Enviar dados do responsável
          const responsavelResponse = await axios.post("http://localhost:8800/responsavel", responsavelData);
          const responsavelId = responsavelResponse.data.RES_Id;
          console.log("Responsável criado, ID:", responsavelId);
      
          // Dados da escola
          const escolaData = {
            nome: dados.aluno.escola.nome,
            cep: removeMask(dados.aluno.escola.cep),
            rua: dados.aluno.escola.rua,
            numero: dados.aluno.escola.numero,
            bairro: dados.aluno.escola.bairro,
            complemento: dados.aluno.escola.complemento,
            contato: dados.aluno.escola.contato,
          };
      
          // Enviar dados da escola
          const escolaResponse = await axios.post("http://localhost:8800/escola", escolaData);
          const escolaId = escolaResponse.data.ESC_Id;
          console.log("Escola criada, ID:", escolaId);
      
          // Dados do aluno
          const dataNascimento = dados.aluno.dataNascimento;
          const [dia, mes, ano] = dataNascimento.split("/");
          const dataNascimentoISO = `${ano}-${mes}-${dia}`;
          const dataNascimentoFormatada = new Date(dataNascimentoISO).toISOString().split("T")[0];
      
          const alunoData = {
            cpf: removeMask(dados.aluno.cpf),
            nomeCompleto: dados.aluno.nomeCompleto,
            dataNascimento: dataNascimentoFormatada,
            serie: dados.aluno.serie,
            turno: dados.aluno.turno,
            deficiencia: dados.aluno.deficiencia,
            medicamento: dados.aluno.medicamento,
            alergia: dados.aluno.alergia,
            raca: dados.aluno.raca,
            sexo: dados.aluno.sexo,
            ALN_Fk_Responsavel: responsavelId,
            ALN_Fk_Escola: escolaId,
          };
      
          // Enviar dados do aluno
          const alunoResponse = await axios.post("http://localhost:8800", alunoData);
          const alunoId = alunoResponse.data.alunoId;
          console.log("Aluno criado, ID:", alunoId);
      
          // Enviar contatos do aluno
          const contatosData = dados.aluno.contatos.map((contato) => ({
            tipo: contato.tipo,
            dono: contato.dono,
            numero: contato.numero,
            alunoId: alunoId,
          }));
      
          await axios.post("http://localhost:8800/contatos", {
            alunoId: alunoId,
            contatos: contatosData,
          });
          console.log("Contatos enviados com sucesso");
      
          // Dados da matrícula na oficina
          for (const oficina of selectedOficinas) {
            const oficinaId = getOficinaIdByName(oficina); // Função fictícia para mapear nome da oficina para ID
            const matriculaData = {
              MAT_Fk_Oficina: oficinaId,
              MAT_Fk_Aluno: alunoId,
              MAT_Data_Matricula: new Date().toISOString().split("T")[0],
              MAT_Status: "Ativo",
            };
      
            const matriculaResponse = await axios.post("http://localhost:8800/matriculas", matriculaData);
            console.log(`Matrícula para oficina "${oficina}" registrada com sucesso:`, matriculaResponse.data);
        }
          console.log("Inscrição concluída com sucesso");
          alert("Inscrição concluída com sucesso");
          navigate("/matriculas");  
        } catch (error) {
          console.error("Erro ao finalizar inscrição", error.response ? error.response.data : error.message);
        }
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

        <main className="container shadow p-4">

            {/* Cabeçalho vermelho */}
            <Container
                fluid
                className="d-flex align-items-center justify-content-center py-0"
                style={{ backgroundColor: '#ad0b0b', color: 'white', height: '10vh' }}
            >
                <h2
                style={{
                    fontFamily: 'Antonio, sans-serif',
                    fontSize: '3rem',
                    fontWeight: '700',
                    color: 'yellow',
                }}
                >
                Ficha de Inscrição
                </h2>
            </Container>

            <Container>
                    <Link
                      to="/matriculas"
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

        
            <Container className="justify-content-center" >

                <Row className="justify-content-center py-0">
                    <Col className="col-md-10">
                        <Row className="mb-4">
                            <Col className="col-md-12" style={{ backgroundColor: 'rgba(173, 11, 11, 0.4)' }}>
                                <Form.Label style={{ fontSize: '30px', fontWeight: 'bold' }}>Dados:</Form.Label>
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col className="col-md-1">
                                <Form.Label style={{ fontSize: '22px', fontWeight: 'bold' }}>Nome:</Form.Label>
                            </Col>
                            <Col className="col-md-11">
                                <Form.Control type="text" placeholder="Insira o nome completo do aluno"
                                name="nomeCompleto" 
                                value={dados.aluno.nomeCompleto}
                                onChange={handledados}
                                 />
                            </Col>
                        </Row>
                        <Row className="mb-2" xs={2} sm={2} md={4}>
                            <Col className="col-lg-1">
                                <Form.Label style={{ fontSize: '22px', fontWeight: 'bold' }}>Idade:</Form.Label>
                            </Col>
                            <Col className="col-lg-1">
                                <Form.Control type="text" value={idade} placeholder="00" readOnly />
                            </Col>
                            <Col className="col-lg-4">
                                <Form.Label style={{ fontSize: '22px', fontWeight: 'bold' }}>Data de Nascimento:</Form.Label>
                            </Col>
                            <Col className="col-lg-2">
                                <InputMask
                                    mask="99/99/9999"
                                    className="form-control"
                                    placeholder="dd/mm/aaaa"
                                    name="dataNascimento"
                                    value={dados.aluno.dataNascimento}
                                    onChange={(e) => {
                                      handledados(e);
                                      const valor = e.target.value;
                                      if (valor.length === 10) calcularIdade(valor); // Chama a função calcularIdade quando o valor tem 10 caracteres
                                    }}
                                />
                            </Col>
                            <Col className="col-lg-1">
                                <Form.Label style={{ fontSize: '22px', fontWeight: 'bold' }}>CPF:</Form.Label>
                            </Col>
                            <Col className="col-lg-3">
                                <InputMask
                                    mask="999.999.999-99"
                                    className="form-control"
                                    placeholder="000.000.000-00"
                                    name="cpf" 
                                    value={dados.aluno.cpf} 
                                    onChange={handledados}
                                />
                                 {cpfInvalido && (
                  <div className="text-danger" style={{ fontSize: '0.9rem', marginTop: '4px' }}>
                    CPF inválido.
                  </div>
                )}
                            </Col>
                        </Row>
                        <Row className="mb-2" xs={3} sm={3}>
                            <Col className="col-md-1">
                                <Form.Label style={{ fontSize: '18px', fontWeight: 'bold' }}>Sexo:</Form.Label>
                            </Col>
                            <Col className="col-md-2">
                            <Form.Check 
                                type="radio"
                                id="sexo-masculino"
                                name="sexo"
                                label="Masculino"
                                value="Masculino"
                                checked={dados.aluno.sexo === "Masculino"} // Marca a opção "Masculino" se for o valor atual
                                onChange={handledados}
                            />
                            </Col>

                            <Col className="col-md-2">
                            <Form.Check 
                                type="radio"
                                id="sexo-feminino"
                                name="sexo"
                                label="Feminino"
                                value="Feminino"
                                checked={dados.aluno.sexo === "Feminino"} // Marca a opção "Feminino" se for o valor atual
                                onChange={handledados}
                            />
                            </Col>
                            <Col className="col-md-1">
                                <Form.Label style={{ fontSize: '18px', fontWeight: 'bold' }}>Raça:</Form.Label>
                            </Col>
                            <Col className="col-md-3">
                                <Form.Select 
                                aria-label="Default select example" 
                                size="sm" 
                                name = "raca"
                                value={dados.aluno.raca} 
                                onChange={handledados}   
                                    >
                                 <option value="">Selecione</option> {/* Melhor usar um valor vazio por padrão */}
                                <option value="Negra">Negra</option>
                                <option value="Parda">Parda</option>
                                <option value="Branca">Branca</option>
                                </Form.Select>
                                </Col>
                        </Row>

                        <Row className="mb-2">
                            <Col className="col-md-2">
                                <Form.Label style={{ fontSize: '22px', fontWeight: 'bold' }}>Escola:</Form.Label>
                            </Col>
                            <Col className="col-md-10">
                                <Form.Control 
                                type="text" 
                                placeholder="Insira o nome da escola" 
                                name="aluno.escola.nome"
                                value={dados.aluno.escola.nome} 
                                onChange={handledadosninhados}  
                                />
                            </Col>
                        </Row>

                        <Row className="mb-2" xs={2} sm={2} >
                            <Col className="col-md-2">
                                <Form.Label style={{ fontSize: '22px', fontWeight: 'bold' }}>Série:</Form.Label>
                            </Col>
                            <Col className="col-md-3">
                            <InputGroup>
                                <Form.Control
                                    type="text"
                                    value={dados.aluno.serie}
                                    name="serie" 
                                    onChange={(e) => {
                                        handledados(e);   // Chama a função que atualiza o estado
                                        //handleChange(e);   // Chama a segunda função, se necessário
                                    }}
                                    
                                    placeholder="Insira a série"
                                />
                                <InputGroupText>
                                º ano                                
                                </InputGroupText>
                                </InputGroup>
                            </Col>

                            <Col className="col-md-2">
                                <Form.Label style={{ fontSize: '22px', fontWeight: 'bold' }}>Turno:</Form.Label>
                            </Col>
                            <Col className="col-md-3">
                                <Form.Select aria-label="Default select example"
                                name = "turno"
                                value={dados.aluno.turno} 
                                onChange={handledados}   
                                >
                                    <option>Insira o turno</option>
                                    <option value="Manhã">Manhã</option>
                                    <option value="Tarde">Tarde</option>
                                    <option value="Noite">Noite</option>
                                </Form.Select>
                            </Col>
                        </Row>

                        

                        <Row className="mb-4 mt-5">
                            <Col className="col-md-12" style={{ backgroundColor: 'rgba(173, 11, 11, 0.4)' }}>
                                <Form.Label style={{ fontSize: '30px', fontWeight: 'bold' }}>Outras informações:</Form.Label>
                            </Col>
                        </Row>

                        <Row className="mb-2">
                            <Col className="col-md-4">
                                <Form.Label style={{ fontSize: '18px', fontWeight: 'bold' }}>Tem alguma deficiência ou transtorno?</Form.Label>
                            </Col>
                            <Col className="col-md-8">
                                <Form.Control as="textarea" rows={2} placeholder="insira a deficiencia"
                                name = "deficiencia"
                                value={dados.aluno.deficiencia} 
                                onChange={handledados}   
                                 />
                            </Col>
                        </Row>

                        <Row className="mb-2">
                            <Col className="col-md-4">
                                <Form.Label style={{ fontSize: '18px', fontWeight: 'bold' }}>Faz uso de algum medicamento?</Form.Label>
                            </Col>
                            <Col className="col-md-8">
                                <Form.Control type="text" placeholder="Insira o medicamento" 
                                name = "medicamento"
                                value={dados.aluno.medicamento} 
                                onChange={handledados}   
                                />
                            </Col>
                        </Row>

                        <Row className="mb-2">
                            <Col className="col-md-4">
                                <Form.Label style={{ fontSize: '18px', fontWeight: 'bold' }}>Possui alguma alergia?</Form.Label>
                            </Col>
                            <Col className="col-md-8">
                                <Form.Control type="text" placeholder="Insira a alergia" 
                                name = "alergia"
                                value={dados.aluno.alergia} 
                                onChange={handledados}   
                                />
                            </Col>
                        </Row>


                        <Row className="mb-4 mt-5">
                            <Col className="col-md-12" style={{ backgroundColor: 'rgba(173, 11, 11, 0.4)' }}>
                                <Form.Label style={{ fontSize: '30px', fontWeight: 'bold' }}>Responsável:</Form.Label>
                            </Col>
                        </Row>

                        <Row className="mb-2" xs={2} sm={2} md={2}>
                            <Col className="col-lg-1">
                                <Form.Label style={{ fontSize: '22px', fontWeight: 'bold' }}>Nome:</Form.Label>
                            </Col>
                            <Col className="col-lg-7">
                                <Form.Control type="text" placeholder="Insira o nome completo do responsavel" 
                                name="aluno.responsavel.nomeCompleto"
                                value={dados.aluno.responsavel.nomeCompleto} 
                                onChange={handledadosninhados}  
                                
                                
                                />
                            </Col>

                            <Col className="col-lg-1">
                                <Form.Label style={{ fontSize: '22px', fontWeight: 'bold' }}>CPF:</Form.Label>
                            </Col>
                            <Col className="col-lg-3">
                                <InputMask
                                    mask="999.999.999-99"
                                    className="form-control"
                                    placeholder="000.000.000-00"
                                    name="aluno.responsavel.cpf" 
                                    value={dados.aluno.responsavel.cpf} 
                                    onChange={handledadosninhados}
                                />
                                              {cpfInvalidoRes && (
                  <div className="text-danger" style={{ fontSize: '0.9rem', marginTop: '4px' }}>
                    CPF inválido.
                  </div>
                )}
                            </Col>
                        </Row>

                        <Row className="mb-2">
                            <Col className="col-md-4">
                                <Form.Label style={{ fontSize: '22px', fontWeight: 'bold' }}>Recebe algum beneficio?</Form.Label>
                            </Col>
                            <Col className="col-md-8">
                                <Form.Control type="text" placeholder="Insira o beneficio" 
                                name="aluno.responsavel.beneficios"
                                value={dados.aluno.responsavel.beneficios} 
                                onChange={handledadosninhados} 
                                />
                            </Col>
                        </Row>


                          <Row className="mb-4 mt-5">
        <Col className="col-md-12" style={{ backgroundColor: 'rgba(173, 11, 11, 0.4)' }}>
          <Form.Label style={{ fontSize: '30px', fontWeight: 'bold' }}>Endereço:</Form.Label>
        </Col>
      </Row>

      <Row className="mb-2" xs={2} sm={2} md={2}>
        <Col className="col-lg-1">
          <Form.Label style={{ fontSize: '22px', fontWeight: 'bold' }}>Rua:</Form.Label>
        </Col>
        <Col className="col-lg-7">
          <Form.Control
            type="text"
            placeholder="Insira o nome da rua"
            name="aluno.responsavel.rua"
            value={dados.aluno.responsavel.rua}
            onChange={handledadosninhados}
          />
        </Col>

        <Col className="col-lg-2">
          <Form.Label style={{ fontSize: '22px', fontWeight: 'bold' }}>Número:</Form.Label>
        </Col>
        <Col className="col-lg-2">
          <Form.Control
            type="text"
            placeholder="Insira o número"
            name="aluno.responsavel.numero"
            value={dados.aluno.responsavel.numero}
            onChange={handledadosninhados}
          />
        </Col>
      </Row>

      <Row className="mb-2" xs={2} sm={2} md={2}>
        <Col className="col-lg-2">
          <Form.Label style={{ fontSize: '22px', fontWeight: 'bold' }}>Bairro:</Form.Label>
        </Col>

        <Col className="col-lg-7">
          <Form.Control
            type="text"
            placeholder="Insira o bairro"
            name="aluno.responsavel.bairro"
            value={dados.aluno.responsavel.bairro}
            onChange={handledadosninhados}
          />
        </Col>

        <Col className="col-lg-1">
          <Form.Label style={{ fontSize: '22px', fontWeight: 'bold' }}>CEP:</Form.Label>
        </Col>

        <Col className="col-lg-2">
          <InputMask
            mask="99999-999"
            className="form-control"
            placeholder="00000-000"
            name="aluno.responsavel.cep"
            value={dados.aluno.responsavel.cep}
            onChange={handledadosninhados}
            onBlur={(e) => buscaEnderecoPorCEP(e.target.value)} // chama ao sair do campo CEP
          />
        </Col>
      </Row>

      <Row className="mb-2">
        <Col className="col-md-2">
          <Form.Label style={{ fontSize: '22px', fontWeight: 'bold' }}>Cidade:</Form.Label>
        </Col>
        <Col className="col-md-10">
          <Form.Control
            type="text"
            placeholder="Insira o nome da cidade"
            name="aluno.responsavel.cidade"
            value={dados.aluno.responsavel.cidade}
            onChange={handledadosninhados}
          />
        </Col>
      </Row>
  

                        <Row className="mb-2">
                            <Col className="col-md-4 col-lg-3">
                                <Form.Label style={{ fontSize: '22px', fontWeight: 'bold' }}>Complemento:</Form.Label>
                            </Col>
                            <Col className="col-md-8 col-lg-9">
                                <Form.Control as="textarea" rows={2} placeholder="Insira o complemento"
                                name="aluno.responsavel.complemento"
                                value={dados.aluno.responsavel.complemento} 
                                onChange={handledadosninhados} 
                                />
                            </Col>
                        </Row>
                        




                        <Row className="mb-4 mt-5">
                            <Col className="col-md-12" style={{ backgroundColor: 'rgba(173, 11, 11, 0.4)' }}>
                                <Form.Label style={{ fontSize: '30px', fontWeight: 'bold' }}>Contato:</Form.Label>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Telefone</th>
                                            <th>Tipo</th>
                                            <th>Dono</th>
                                            <th>Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {contatos.map((contato, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <InputMask
                                                        mask="(99) 99999-9999"
                                                        value={contato.numero}
                                                        onChange={(e) => atualizarContato(index, 'numero', e.target.value)}
                                                        aria-label={`Telefone do contato ${index + 1}`}
                                                    >
                                                        {(inputProps) => (
                                                            <Form.Control 
                                                                {...inputProps} 
                                                                type="text" 
                                                                placeholder="(00) 00000-0000" 
                                                            />
                                                        )}
                                                    </InputMask>
                                                </td>
                                                <td>
                                                    <Form.Select
                                                        value={contato.tipo}
                                                        onChange={(e) =>
                                                            atualizarContato(index, 'tipo', e.target.value)
                                                        }
                                                        aria-label={`Tipo do contato ${index + 1}`}
                                                    >
                                                        <option value="">Selecione</option>
                                                        <option value="Residencial">Residencial</option>
                                                        <option value="Comercial">Comercial</option>
                                                        <option value="Celular">Celular</option>
                                                    </Form.Select>
                                                </td>
                                                <td>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Nome do responsável"
                                                        value={contato.dono}
                                                        onChange={(e) =>
                                                            atualizarContato(index, 'dono', e.target.value)
                                                        }
                                                        aria-label={`Dono do telefone ${index + 1}`}
                                                    />
                                                </td>
                                                <td>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => removerContato(index)}
                                                        aria-label={`Remover contato ${index + 1}`}
                                                    >
                                                        Remover
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="text-center mb-2">
                                <Button
                                    variant="success"
                                    onClick={adicionarContato}
                                    aria-label="Adicionar novo contato"
                                >
                                    Adicionar Contato
                                </Button>
                            </Col>
                        </Row>





                        <Row className="mb-3 mt-5">
                            <Col className="col-md-12" style={{ backgroundColor: 'rgba(173, 11, 11, 0.4)' }}>
                                <Form.Label style={{ fontSize: '30px', fontWeight: 'bold' }}>Oficina:</Form.Label>
                            </Col>
                        </Row>

                        <Row className="mb-4">

                            <Col className="col-md-12 text-center mb-2">
                                <Form.Label style={{ fontSize: '22px', fontWeight: 'bold' }}>Selecione uma oficina:</Form.Label>
                            </Col>

                            {/* Seção de "Oficinas" */}

                            <Row>
                              {oficinasDisponiveis.map((oficina) => {
                                  const desabilitada = oficina.OFC_Vagas === 0 || oficinaTemConflito(oficina);

                                  return (
                                    <Col className="col-md-3" key={oficina.OFC_Id}>
                                      <Form.Check
                                        type="checkbox"
                                        id={`oficina-${oficina.OFC_Id}`}
                                        name="oficinas"
                                        label={oficina.OFC_Nome}
                                        value={oficina.OFC_Nome}
                                        checked={selectedOficinas.includes(oficina.OFC_Nome)}
                                        onChange={handleOficinaChange}
                                        disabled={desabilitada}
                                        style={{
                                          color: desabilitada ? 'red' : 'inherit',
                                          fontWeight: desabilitada ? 'bold' : 'normal'
                                        }}
                                      />
                                    </Col>
                                  );
                                })}
                              <Col className="col-12 mt-3">
                                <div className="border-top pt-2"></div>
                              </Col>
                            </Row>
                        </Row>


                    </Col>

                </Row>

                    <Row className="mb-4">
                        <Col className="d-flex justify-content-center">
                          <Form.Group 
                            style={{
                              backgroundColor: '#f3f3f3',
                              padding: '12px 20px',
                              borderRadius: '10px',
                              border: '1px solid #ccc',
                              display: 'inline-block',
                              color: 'black',
                            }}
                          >
                            <Form.Check 
                              type="checkbox"
                              id="confirmacao-responsavel"
                              label="estou ciente que os dados de matrícula foram fornecidos e realizados diante do responsável."
                              checked={confirmadoResponsavel}
                              onChange={(e) => setConfirmadoResponsavel(e.target.checked)}
                              style={{
                                backgroundColor: '#f3f3f3',
                                fontFamily: 'Antonio, sans-serif',
                                fontSize: '1rem',
                                fontWeight: '500',
                                color: 'black'
                              }}
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row className='mb-5'>
                        <Col className="text-center">
                          <Button 
                            style={{ fontSize: '20px', fontWeight: 'bold' }}
                            variant="success"
                            onClick={finalizarInscricao}
                            disabled={!confirmadoResponsavel}
                            aria-label="Finalizar Inscrição"
                          >
                            Finalizar Inscrição
                          </Button>
                        </Col>
                      </Row>

            </Container>

        </main>
    );
}

export default CriarMatricula;