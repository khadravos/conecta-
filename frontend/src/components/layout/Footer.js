import style from './Footer.module.css'

import logo from '../../img/logoGAaj.png'

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faWhatsapp, faInstagram } from "@fortawesome/free-brands-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";

function Footer() {
    return(

        <footer className="text-white py-2" style={{backgroundColor: '#ad0b0b'}}>
            <div className="container">
                <div className="row justify-content-between">
                    {/* Logo à esquerda */}
                    <div className="col-md-3 text-center">
                        <img src={logo} alt="Logo" className="img-fluid" style={{ maxWidth: "150px" }} />
                    </div>

                    {/* Texto de copyright no centro */}
                    <div className="col-md-3 text-center">
                        <p>&copy; 2024 Conecta+. Todos os direitos reservados.</p>
                    </div>

                    {/* Ícones de redes sociais à direita */}
                    <div className="col-md-3 text-center" style={{ justifyContent: 'space-between' }}>
                        <a href="https://www.facebook.com/gaaj.cultura?mibextid=ZbWKwL" className="text-white" style={{ marginRight: '25px'}} target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faFacebookF} size="2x"/>
                        </a>
                        <a href="#" className="text-white" style={{ marginRight: '25px' }}>
                        <FontAwesomeIcon icon={faWhatsapp} size="2x"/>
                        </a>
                        <a href="https://www.instagram.com/gaajroseira?igsh=eGNuaDJtb21xOXpq" className="text-white" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faInstagram} size="2x"/>
                        </a>
                    </div>
                </div>
            </div>
        </footer>

    )
}

export default Footer;