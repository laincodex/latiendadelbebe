import React, { useState } from "react";
import Logo from "./Logo";
import MapImageSrc from "../../../assets/images/map.png";
import Tooltip from "./Tooltip";
import Overlay from "./Overlay";

import FacebookIcon from "../../../assets/icons/f_logo_RGB-Blue_1024.svg";
import HomeIcon from "../../../assets/icons/home-24px.svg";
import PhoneIcon from "../../../assets/icons/phone-24px.svg";
import EmailIcon from "../../../assets/icons/email-24px.svg";

export interface TSNSData {
    address :string,
    facebookUrl :string,
    phone :string,
    email :string
};

export default () => {

    const [mapOverlayOpen, setMapOverlayOpen] = useState<boolean>(false);

    const snsData :TSNSData = {
        address: "Ameghino 695, Pergamino, Buenos Aires.",
        facebookUrl: "facebook.com/LTiendadelbebe",
        phone: "2477 - 777777",
        email: "hola@latiendadelbebe.com.ar"
    }

    const openMapOverlay = () => {
        setMapOverlayOpen(true);
    }
    
    const closeMapOverlay = () => {
        setMapOverlayOpen(false);
    }

    return (
        <footer>
            <div className="footer-content content-width">
                <div className="footer-map">
                    <Tooltip title="Haz click para agrandar el mapa!" marginTop={100} marginLeft={100} onClick={openMapOverlay}>
                        <img src={MapImageSrc}/>
                    </Tooltip>
                    <Overlay openState={mapOverlayOpen} closeCallback={closeMapOverlay}>
                        <div className="footer-map-overlay">
                            Map <a href="#">here</a>
                        </div>
                    </Overlay>
                </div>
                <div className="footer-sns">
                    <ul>
                        <li><h1>Visitanos!</h1></li>
                        <li><HomeIcon />{snsData.address}</li>
                        <li><FacebookIcon className="facebook-logo-svg" /><a target="_blank" href={"https://" + snsData.facebookUrl}>{snsData.facebookUrl}</a></li>
                        <li><PhoneIcon />{snsData.phone}</li>
                        <li><EmailIcon /><a href={"mailto:" + snsData.email}>{snsData.email}</a></li>
                    </ul>
                </div>
                <div className="footer-logo">
                    <Logo disableImage={true} />
                </div>
            </div>
        </footer>
    );
}