import React from "react";
import SectionTitle from "./sectiontitle";
import { SNSData } from "../../Utils";

export default () => {
    return (
        <div className="about-us-container">
            <div className="about-us-content">
                <SectionTitle title="SOBRE NOSOTROS" />
                <article>{SNSData.aboutUsText}</article>
            </div>
        </div>
    );
}