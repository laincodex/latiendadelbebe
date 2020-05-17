import React from "react";

export default (
    {title, marginLeft = 0, marginTop = 0, children} : 
    {
        title :string, 
        marginLeft? :number, 
        marginTop? :number, 
        children :React.ReactNode
    }
) => {
    return (
        <div className="tooltip-container">
            <span className="tooltip-text" 
                style={{marginLeft: marginLeft, marginTop: marginTop}}
            >{title}</span>
            <div className="tooltip-content">{children}</div>
        </div>
    );
}