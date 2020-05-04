import React from "react";
import SectionTitle from "./sectiontitle";

const aboutUsText = "Somos una tienda ubicada en bla bla bla, los esperamos!";
export default () => {
    return (
        <div className="about-us-container">
            <div className="about-us-content">
                <SectionTitle title="SOBRE NOSOTROS" />
                <article>{aboutUsText}</article>
            </div>
        </div>
    );
}