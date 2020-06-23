import React, { useState, useEffect } from "react";
import Logo from "../../home/components/Logo";
import Snackbar, { SnackbarTime, SnackbarStyles } from "../../../components/Snackbar";

import { useIsFirstRender } from "../../Utils";

export default ({ error, refUrl } : { error? :string, refUrl :string}) => {
    const [errorSnackbarActive, setErrorSnackbarActive] = useState<boolean>(false);
    const isFirstRender = useIsFirstRender();
    useEffect(()=> {
        if (isFirstRender && error) {
            setErrorSnackbarActive(true);
            setTimeout(() => setErrorSnackbarActive(false),SnackbarTime);
        }
    },[]);
    return (
        <div className="admin-login-container">
            <div className="admin-login-content">
                <Logo />
                <form method="POST" action={"/admin/login?ref=" + escape(refUrl)}>
                    <input type="text" placeholder="Usuario" name="username" required/>
                    <input type="password" placeholder="Contraseña" name="password" required/>
                    <button className="main-btn" type="submit">ENTRAR</button>
                </form>
            </div>
            <a href="/"><button className="admin-login-backbtn">VOLVER</button></a>
            <Snackbar type={SnackbarStyles.ERROR} message={error || ""} isActive={errorSnackbarActive} />
        </div>
    );
}