import React from "react";

interface Props extends React.DOMAttributes<HTMLElement> {
    openState :boolean, 
    closeCallback: Function, 
    children :React.ReactNode
}
export default ({openState, closeCallback, children, ...rest}: Props) => {
    var mouseDownTarget :any;
    const isVisible = () :React.CSSProperties => {
        return (openState) ? {
            visibility: "visible",
            opacity: 1
        } : {};
    }
    const closeOverlay = (ev :any) => {
        // Ignore close if the click is outside the content
        // So only captures if the target is overlay-content but not his children
        if (ev.target !== ev.currentTarget) 
            return;

        // Check click starts and ends outside the content
        if (ev.target !== mouseDownTarget)
            return;
        closeCallback();
    }
    const captureMouseDownTarget = (ev :any) => {
        mouseDownTarget = ev.target;
    }
    return (
        <div className="overlay" style={isVisible()}>
            <div className="overlay-background"></div>
            <div className="overlay-content" onMouseDown={captureMouseDownTarget} onMouseUp={closeOverlay} id="overlay-content" {...rest}>{children}</div>
        </div>
    );
}