import React from "react";
import Logo from "./Logo";
import MapImageSrc from "../../../assets/images/map.png";
import Tooltip from "./Tooltip";

export default () => {
    return (
        <footer>
            <div className="footer-content content-width">
                <div className="footer-map">
                    <Tooltip title="Haz click para agrandar el mapa!" marginTop={100} marginLeft={100}>
                        <img src={MapImageSrc} />
                    </Tooltip>
                </div>
                <div className="footer-sns"></div>
                <div className="footer-logo">
                    <Logo disableImage={true} />
                </div>
            </div>
        </footer>
    );
}