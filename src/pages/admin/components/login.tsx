import React from "react";
import Logo from "../../home/components/Logo";

export default () => {
    return (
        <div className="admin-login-container">
            <div className="admin-login-content">
                <Logo />
                <input type="text" placeholder="Usuario" />
                <input type="text" placeholder="Contraseña" />
                <button>ENTRAR</button>
            </div>
        </div>
    );
}