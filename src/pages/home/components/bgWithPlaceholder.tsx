import React from "react";
import ImagePlaceholder from "../../../assets/icons/placeholder.svg";

interface Props extends React.DOMAttributes<HTMLElement>{
    style? :React.CSSProperties,
    className? :string,
    children? :React.ReactNode,
}
export default ( {style, className = "", children, ...rest} :Props) => {
    return (
        <div className={"bgimage-placeholder " + className}>
            <div className="bgimage-placeholder-svg"><ImagePlaceholder className={className} /></div>
            <div className={"bgimage-placeholder-children " + className} style={style} {...rest}>{children}</div>
        </div>
    );
}