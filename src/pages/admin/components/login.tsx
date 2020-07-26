import React, { useState, useEffect } from "react";
import Logo from "../../home/components/Logo";
import Snackbar, { SnackbarTime, SnackbarStyles } from "../../../components/Snackbar";
import ArrowBackIcon from "../../../assets/icons/arrow_back-24px.svg";

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
    
    const goToMainSite = () => {
        document.location.href = "/";
    };

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
            <button onClick={goToMainSite} className="btn-light-blue admin-login-backbtn"><ArrowBackIcon />Volver</button>
            <Snackbar type={SnackbarStyles.ERROR} message={error || ""} isActive={errorSnackbarActive} />
        </div>
    );
}