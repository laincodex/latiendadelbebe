import React from "react";
import SectionTitle from "./sectiontitle";

export default () => {
    return (
        <div className="new-products-container">
            <div className="new-products-content">
                <SectionTitle title="NUEVOS PRODUCTOS"/>
                <div className="new-products-list"></div>
            </div>
        </div>
    );
};