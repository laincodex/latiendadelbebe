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
                    <button type="submit">ENTRAR</button>
                    {loginError()}
                </form>
            </div>
        </div>
    );
}