import React from "react";
import Overlay from "../../home/components/Overlay";

interface Props {
    openState :boolean
};
export default ( {openState } :Props) => {
    return (
        <Overlay openState={openState} centered={true} closeCallback={() => {}}>
            <div className="loading-circle"></div>
        </Overlay>
    );
}