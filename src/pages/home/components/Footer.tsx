import React, { useState } from "react";
import Logo from "./Logo";
import MapImageSrc from "../../../assets/images/map.png";
import Tooltip from "./Tooltip";
import Overlay from "./Overlay";
import BgWithPlaceholder from "../../home/components/bgWithPlaceholder";

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
        address: "Bv. Ameghino 695, Pergamino, Buenos Aires.",
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
                <BgWithPlaceholder className="footer-map">
                    <Tooltip title="Haz click para agrandar el mapa!" onClick={openMapOverlay}>
                        <img src={MapImageSrc}/>
                    </Tooltip>
                    <Overlay openState={mapOverlayOpen} closeCallback={closeMapOverlay}>
                        <div className="footer-map-overlay-container" onClick={closeMapOverlay}>
                            <div className="footer-map-overlay" id="google-map">
                                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3312.316142907874!2d-60.57786404867735!3d-33.881510927056226!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95b9caae8751ce5d%3A0xeb82183f25427954!2sBv.%20Ameghino%20695%2C%20Pergamino%2C%20Buenos%20Aires!5e0!3m2!1ses-419!2sar!4v1590372809218!5m2!1ses-419!2sar" width="100%" height="100%" aria-hidden="false"></iframe>
                            </div>
                        </div>
                    </Overlay>
                </BgWithPlaceholder>
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