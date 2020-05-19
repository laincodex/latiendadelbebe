import React from "react";

interface Props extends React.DOMAttributes<HTMLElement>{
    title :string, 
    marginLeft? :number, 
    marginTop? :number, 
    children :React.ReactNode
}

export default (
    {title, marginLeft = 0, marginTop = 0, children, ...rest} : Props
) => {
    return (
        <div className="tooltip-container" {...rest}>
            <span className="tooltip-text" 
                style={{marginLeft: marginLeft, marginTop: marginTop}}
            >{title}</span>
            <div className="tooltip-content">{children}</div>
        </div>
    );
}