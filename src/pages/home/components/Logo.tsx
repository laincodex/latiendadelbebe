import React from "react";
import LogoImageSrc from "../../../assets/images/logo.png";
import LogoText from "../../../assets/images/logo.svg";

export default ({disableImage = false, disableText = false} : { disableImage? :boolean, disableText?: boolean}) => {
    return (
        <div className="logo-container">
            {(() => {if (!disableImage) return(<div className="logo-image"> <img src={LogoImageSrc} /> </div> );})()}
            {(() => {if (!disableText) return (
                <div className="logo-text-container no-select">
                    <LogoText />
                </div>
            )})()}
        </div>
    );
}