import { Container } from 'react-bootstrap';

import Img from '../../img/Gaaj.jpg'


function Conheca() {

    return (

      <main className="container shadow p-4 justify-content-center">

        <Container>

          <h1 className="mb-5" style={{ fontFamily: "'Lora', serif", letterSpacing: "0.01em", fontWeight: "700" }}>Breve História</h1>

          <p>

            A Liga Assistencial Roseirense devidamente registrada em Cartório de Registro de Pessoas Jurídicas na cidade de Aparecida, estado de São Paulo, criada em 1º de julho de 1995 e que, a partir de 14 de agosto de 2001, executa o Projeto Grupo de Apoio e Amparo à Juventude – GAAJ – é uma entidade filantrópica e promocional, sem fins lucrativos.

          </p>

          <p>

            Inicialmente, seu objetivo era atender crianças e adolescentes, através do Projeto Guarda Mirim. Mais tarde, através da iniciativa de um grupo de mães voluntárias, desenvolveram atividades voltadas para o Projeto Grupo de Apoio e Amparo à Juventude, mantendo as finalidades estatutárias de quando foi criada, porém modificando sua proposta pedagógica.

          </p>

          <p>

            Essas mães, em busca de uma orientação sobre como proceder, visitaram entidades sociais da região e concluíram queera absolutamente viável desenvolver no município de Roseira-SP, o Projeto GAAJ. Formularam um diagnóstico e idealizaram várias propostas, como alternativas viáveis às necessidades encontradas no município.
            
          </p>

          <p>

            O Grupo de Apoio e Amparo à Juventude – GAAJ – desenvolve hoje ações socioeducativas com crianças e adolescentes em situação de vulnerabilidade e/ou risco social, na faixa etária de 6 a 17 anos e, paralelamente, trabalhos com as famílias dos usuários e com a comunidade local, atividades voltadas para a qualificação para o trabalho e fortalecimento de vínculos sociais.

          </p>

        </Container>

        <Container className='py-3' style={{ border: '3px solid #ad0b0b', borderRadius: '10px' }}>

          <Container 
            style={{
              backgroundImage: `url(${Img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'top',
              height: '60vh',
              borderRadius: '10px'
            }}
          ></Container>

          <h1 className="my-5 text-center" style={{ fontFamily: "'Lora', serif", letterSpacing: "0.01em", fontWeight: "700", color: "#ad0b0b" }}>Apresentação</h1>

          <p>

            O Grupo de Apoio e Amparo à Juventude – GAAJ – é uma entidade filantrópica e promocional, sem fins lucrativos, mantida por doações mensais de sócios mantenedores e parceiros da comunidade local, que atende gratuitamente crianças e adolescentes em situação de vulnerabilidade social, de 06 a 17 anos, no contra turno escolar.

          </p>

          <p>

            É o único projeto social de Roseira que atende crianças e adolescentes com esse escopo de condições, desenvolvendo atividades educacionais, culturais, de lazer e esporte, favorecendo a saúde e bem estar de todos os participantes, assim como a integração social entre os atendidos do Projeto. Desempenha também atividades de qualificação para o trabalho com suas famílias, de forma a capacitar seus membros a exercer uma função remunerada, garantindo uma melhor qualidade de vida.

          </p>

          <p>

            O GAAJ tem como objetivo favorecer o desenvolvimento físico, intelectual, afetivo, cultural, recreativo e social dos atendidos de 06 a 17 anos, facilitando o desenvolvimento de suas habilidades e atitudes de forma lúdica, visando a emancipação social.
            São atividades praticadas na instituição: música, artesanato, corte e costura, cerâmica e terracota, plantio de horta orgânica e comunitária, ginástica, dentre outras, de forma a proporcionar ampliação de saberes, compartilhamento de ideias, com diferentes aprendizagens e desenvolvimento de valores e atitudes socialmente éticas e morais.
            
          </p>

          <p>

            O projeto atende em média de forma, direta e indireta, 60 pessoas por semana, dentre elas: crianças, adolescentes e jovens, na faixa etária de 06 a 17 anos, ofertando atividades socioeducativas, além de adultos, usuários acima de 18 anos, com atividades de qualificação profissional e geração de renda familiar.

          </p>


        </Container>

        
      </main>
        
      );

}

export default Conheca;