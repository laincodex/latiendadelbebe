import React from "react";

interface IProps {
    title :string
}

export default (props :IProps) => {
    return (
        <div className="section-title">
            <div className="section-title-line"></div>
            <div className="section-title-text">{props.title}</div>
            <div className="section-title-line"></div>
        </div>
    );
}