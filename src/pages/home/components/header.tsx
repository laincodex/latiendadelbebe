import React from "react";

import logo from "../../../assets/images/logo.png";

export default (props :any) => {
    return (
        <header>
            <div className="header-content content-width">
                <div className="logo-container">
                    <div className="header-logo"> <img src={logo} /> </div>
                    <div className="logo-text-container">
                        <div className="logo-text-top">LA TIENDA</div>
                        <div className="logo-text-bottom">
                            <div className="logo-text-2">DEL</div>
                            <div className="logo-text-3">BEBE</div>
                        </div>
                    </div>
                </div>
                <div className="menu-container">
                    <ul>
                        <li><a href="#">Productos</a></li>
                        <li><a href="#">¿Donde estamos?</a></li>
                        <li className="search-component">Search Component Here</li>
                    </ul>
                </div>
            </div>
        </header>
    );
};