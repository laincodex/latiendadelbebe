import React from "react";
import LogoImageSrc from "../../../assets/images/logo.png";
import LogoText from "../../../assets/images/logo.svg";
import LogoTextInline from "../../../assets/images/logo_inline.svg";

export default ({disableImage = false, disableText = false, inlineText = false} : { disableImage? :boolean, disableText?: boolean, inlineText? :boolean}) => {
    return (
        <div className="logo-container">
            {(() => {if (!disableImage) return(<div className="logo-image"> <img src={LogoImageSrc} /> </div> );})()}
            {(() => {if (!disableText) return (
                <div className="logo-text-container no-select">
                    {inlineText ? <LogoTextInline /> : <LogoText />}
                </div>
            )})()}
        </div>
    );
}