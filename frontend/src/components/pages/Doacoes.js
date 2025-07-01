import { Container, Col } from 'react-bootstrap';



function Doacoes() {

    return (

      <main className="container shadow p-4">

        <Container>

          <h1 className="mb-5" style={{ fontFamily: "'Lora', serif", letterSpacing: "0.01em", fontWeight: "700" }}>Doações</h1>

          <p>

            Os problemas encontrados referem-se aos poucos recursos financeiros disponíveis, falta de um espaço físico próprio para a realização das atividades, que poderiam ser oferecidas a um maior número de pessoas, se a entidade pudesse contar com a possibilidade de remuneração de professores contratados e equipe técnica.

          </p>

          <p>

            Você pode colaborar doando prendas para eventos beneficentes assim como serviços, produtos, cupons fiscais e cadastramentos de cupons no Programa Nota Fiscal Paulista.

          </p>

        </Container>

        <Container className='mb-0' style={{backgroundColor: '#ad0b0b', color: 'white', borderRadius: '10px' }}>  

          <h1 className="my-0 text-center" style={{ fontFamily: "'Lora', serif", letterSpacing: "0.01em", fontWeight: "700" }}>"SOLIDARIEDADE! UMA PRÁTICA QUE SALVA VIDAS"</h1>

        </Container>

        <Container text-center>

          <h1 className="my-5 text-center" style={{ fontFamily: "'Lora', serif", letterSpacing: "0.01em", fontWeight: "700" }}>Custeios das atividades oferecidas </h1>

          <h2 style={{ fontFamily: "'Lora', serif", letterSpacing: "0.01em", fontWeight: "700" }}>Recursos Próprios</h2>

          <p>

            Contribuições mensais de sócios mantenedores, além da realização de bingos e eventos beneficentes.

          </p>

          <Col className="col-12 mt-3">
            <div className="border-top pt-2"></div> {/* Linha horizontal */}
          </Col>

          <h2 style={{ fontFamily: "'Lora', serif", letterSpacing: "0.01em", fontWeight: "700" }}>Repasse Municipal</h2>

          <p>

            Repasse de 01 (um) salário mínimo através da lei de fomento vigente.

          </p>

          <Col className="col-12 mt-3">
            <div className="border-top pt-2"></div> {/* Linha horizontal */}
          </Col>

          <h2 style={{ fontFamily: "'Lora', serif", letterSpacing: "0.01em", fontWeight: "700" }}>Recursos de Penas Pecuniárias - Fórum de Roseira</h2>

          <p>

            Repasse de recursos de penas pecuniárias – Resolução 154/2012, feito pelo MM. Juiz de Direito da Comarca de Roseira/SP.

          </p>

          <Col className="col-12 mt-3">
            <div className="border-top pt-2"></div> {/* Linha horizontal */}
          </Col>

          <h2 style={{ fontFamily: "'Lora', serif", letterSpacing: "0.01em", fontWeight: "700" }}>Doações Diversas</h2>

          <p>

            Doações esporádicas recebidas pela Prefeitura Municipal de Roseira (venda de bens da municipalidade), ABAS (Associação Banespiana de Assistência Social), entre outros.

          </p>

          <Col className="col-12 mt-3">
            <div className="border-top pt-2"></div> {/* Linha horizontal */}
          </Col>

        </Container>


        <Container>

        <Container  className='' style={{ border: '3px solid #ad0b0b', borderRadius: '10px' }}>

          <h2 className="text-center" style={{ fontFamily: "'Lora', serif", letterSpacing: "0.01em", fontWeight: "700" }}>Para fazer sua doação em dinheiro, basta depositar o valor desejado na conta do GAAJ.</h2>

          <Container style={{color: "#ad0b0b"}}>

            <p className="m-0 text-center fw-bold" style={{ fontFamily: "'Lora', serif", fontSize: '1.4rem', fontWeight: "300" }}> Conta Corrente: 7702-X </p>

            <p className="m-0 text-center fw-bold" style={{ fontFamily: "'Lora', serif", fontSize: '1.4rem', fontWeight: "300" }}> Agência: 6935-3 </p>

            <p className="m-0 text-center fw-bold" style={{ fontFamily: "'Lora', serif", fontSize: '1.4rem', fontWeight: "300" }}> Banco do Brasil </p>

            <p className="m-0 text-center fw-bold" style={{ fontFamily: "'Lora', serif", fontSize: '1.4rem', fontWeight: "300" }}> CNPJ: 00.892.139/0001-97 </p>

          </Container>

          <h2 className="text-center" style={{ fontFamily: "'Lora', serif", letterSpacing: "0.01em", fontWeight: "700" }}>Para fazer sua doação em dinheiro, basta depositar o valor desejado na conta do GAAJ.</h2>

          </Container>

        </Container>

      
      </main>
        
      );

}

export default Doacoes;