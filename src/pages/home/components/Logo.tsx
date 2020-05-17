import React from "react";
import LogoImageSrc from "../../../assets/images/logo.png";

export default ({disableImage = false, disableText = false} : { disableImage? :boolean, disableText?: boolean}) => {
    return (
        <div className="logo-container">
            {(() => {if (!disableImage) return(<div className="logo-image"> <img src={LogoImageSrc} /> </div> );})()}
            {(() => {if (!disableText) return (
                <div className="logo-text-container no-select">
                    <div className="logo-text-top">LA TIENDA</div>
                    <div className="logo-text-bottom">
                        <div className="logo-text-2">DEL</div>
                        <div className="logo-text-3">BEBE</div>
                    </div>
                </div>
            )})()}
        </div>
    );
}