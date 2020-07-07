import React from "react";

import Logo from "./home/components/Logo";
import ArrowBackIcon from "../assets/icons/arrow_back-24px.svg";

export default () => {
    return (
        <div className="notfound-container">
            <div className="notfound-content">
                <Logo />
                <span>Oops, este sitio no existe.</span>
            </div>
            <a href="/" className="btn-light-blue btn-icon-rotate360"><ArrowBackIcon />Ir a la p&aacute;gina principal</a>
            <span>Si crees que esto es un error, por favor cont&aacute;ctanos a webmaster@latiendadelbebe.com.ar</span>
        </div>
    );
};