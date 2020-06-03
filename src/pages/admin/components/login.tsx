import React from "react";
import Logo from "../../home/components/Logo";

export default ({ error } : { error? :string}) => {
    const loginError = () => {
        if(!error)
            return <span></span>;
        return <span className="admin-login-error">{error}</span>;
    }
    return (
        <div className="admin-login-container">
            <div className="admin-login-content">
                <Logo />
                <form method="POST" action="/admin/login">
                    <input type="text" placeholder="Usuario" name="username" required/>
                    <input type="password" placeholder="Contraseña" name="password" required/>
                    <button className="main-btn" type="submit">ENTRAR</button>
                    {loginError()}
                </form>
            </div>
            <a href="/"><button className="admin-login-backbtn">VOLVER</button></a>
        </div>
    );
}