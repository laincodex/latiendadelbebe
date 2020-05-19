import React from "react";
import Logo from "./Logo";

export default () => {
    return (
        <header>
            <div className="header-content content-width">
                <Logo />
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