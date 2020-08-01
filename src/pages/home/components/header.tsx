import React from "react";
import Logo from "./Logo";

import HomeIcon from "../../../assets/icons/home-24px.svg";
import ProductIcon from "../../../assets/icons/local_mall-24px.svg";
import ContactIcon from "../../../assets/icons/email-24px.svg";

export default () => {
    return (
        <header>
            <div className="header-content content-width">
                <a href="/"><Logo /></a>
                <div className="menu-container">
                    <ul>
                        <li><a href="/"><HomeIcon />Home</a></li>
                        <li><a href="/productos"><ProductIcon />Productos</a></li>
                        <li><a href="/contacto"><ContactIcon />Contacto</a></li>
                    </ul>
                </div>
            </div>
        </header>
    );
};