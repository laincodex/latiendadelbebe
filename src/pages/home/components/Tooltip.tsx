import React from "react";

interface Props extends React.DOMAttributes<HTMLElement>{
    title :string, 
    style? :React.CSSProperties,
    children :React.ReactNode
}

export default (
    {title, style, children, ...rest} : Props
) => {
    return (
        <div className="tooltip-container" {...rest}>
            <span className="tooltip-text" 
                style={style}
            >{title}</span>
            <div className="tooltip-content">{children}</div>
        </div>
    );
}