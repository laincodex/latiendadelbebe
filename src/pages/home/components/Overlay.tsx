import React, { useEffect, useRef } from "react";
import { useIsFirstRender } from "../../Utils";

interface Props extends React.DOMAttributes<HTMLElement> {
    openState :boolean, 
    closeCallback: Function, 
    children :React.ReactNode
}

export default ({openState, closeCallback, children, ...rest}: Props) => {
    var mouseDownTarget :any;
    const oldScrollSize = useRef<number>(0);
    const oldOverflowStyle = useRef<string>("");

    const isVisible = () :React.CSSProperties => {
        return (openState) ? {
            visibility: "visible",
            opacity: 1
        } : {};
    }

    const contentRef :React.Ref<HTMLDivElement> = React.createRef() ;

    const isFirstRender = useIsFirstRender();
    useEffect(()=>{
        // Ignore first event fire on mount/
        if (isFirstRender)
            return;

        if (openState) {
            disableScroll();
            contentRef.current?.focus();
        } else {
            disableScroll(false);
        }
    },[openState]);

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

    const handleEscape = (ev :any) => {
        if (ev.keyCode === 27)
            closeCallback();
    }

    const getScrollbarSize = () => (window.innerWidth - document.body.clientWidth);
    const getPadding = () => parseInt(document.body.style.paddingRight, 10) || 0;

    const disableScroll = (disable :boolean = true) => {
        // if scroll exists)
        if (document.body.scrollHeight > document.body.clientHeight) {
            if (disable && document.body.style.overflow != "hidden") {
                oldScrollSize.current = getScrollbarSize();
                oldOverflowStyle.current = document.body.style.overflow;

                document.body.style.paddingRight = `${(getPadding() + oldScrollSize.current)}px`;
                document.body.style.overflow = "hidden";
            } else {
                document.body.style.paddingRight = `${(getPadding() - (oldScrollSize.current))}px`;
                document.body.style.overflow = oldOverflowStyle.current;
            }
        }
    }

    return (
        <div className="overlay" style={isVisible()}>
            <div className="overlay-background"></div>
            <div className="overlay-content" ref={contentRef} tabIndex={0} onKeyUp={handleEscape} onMouseDown={captureMouseDownTarget} onMouseUp={closeOverlay} id="overlay-content" {...rest}>{children}</div>
        </div>
    );
}