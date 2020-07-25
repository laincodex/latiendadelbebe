import React from "react";
import Logo from "./Logo";

export default () => {
    return (
        <header>
            <div className="header-content content-width">
                <a href="/"><Logo /></a>
                <div className="menu-container">
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/productos">Productos</a></li>
                        <li><a href="/contacto">Contacto</a></li>
                    </ul>
                </div>
            </div>
        </header>
    );
};