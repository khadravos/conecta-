import style from './header.module.css'

import logo from '../../img/conectaLogoSombreado.png'

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faWhatsapp, faInstagram } from "@fortawesome/free-brands-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";

function Header() {
    return(

        <header className="text-white py-0" style={{backgroundColor: '#ad0b0b'}}>
            <div className="container">
                <div className="row justify-content-between">
                    {/* Logo à esquerda */}
                    <div className="col-md-3 text-center">
                        <img src={logo} alt="Logo" className="img-fluid" style={{ maxWidth: "120px" }} />
                    </div>

                    {/* Ícones de redes sociais à direita */}
                    <div className="col-md-3 text-center" style={{ justifyContent: 'space-between' }}>
                        <a href="https://www.facebook.com/gaaj.cultura?mibextid=ZbWKwL" className="text-white" style={{ marginRight: '25px'}} target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faFacebookF} style={{ fontSize: '1.5rem' }}/>
                        </a>
                        <a href="#" className="text-white" style={{ marginRight: '25px' }}>
                        <FontAwesomeIcon icon={faWhatsapp} style={{ fontSize: '1.5rem' }}/>
                        </a>
                        <a href="https://www.instagram.com/gaajroseira?igsh=eGNuaDJtb21xOXpq" className="text-white" target="_blank" rel="noopener noreferrer" >
                        <FontAwesomeIcon icon={faInstagram} style={{ fontSize: '1.5rem' }}/>
                        </a>
                    </div>
                </div>
            </div>
        </header>

    )
}

export default Header;