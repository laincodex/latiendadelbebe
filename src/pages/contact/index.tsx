import React, { useState } from "react";
import Header from "../home/components/header";

import MapImageSrc from "../../assets/images/map.png";
import Tooltip from "../home/components/Tooltip";
import Overlay from "../home/components/Overlay";
import BgWithPlaceholder from "../home/components/bgWithPlaceholder";
import Logo from "../home/components/Logo";

import FacebookIcon from "../../assets/icons/f_logo_RGB-Blue_1024.svg";
import HomeIcon from "../../assets/icons/home-24px.svg";
import PhoneIcon from "../../assets/icons/phone-24px.svg";
import EmailIcon from "../../assets/icons/email-24px.svg";
export default () => {
    const [mapOverlayOpen, setMapOverlayOpen] = useState<boolean>(false);
    const openMapOverlay = () => {
        setMapOverlayOpen(true);
    };
    const closeMapOverlay = () => {
        setMapOverlayOpen(false);
    };
    return (
        <div className="app-container">
            <Header />
            <div className="contacto-container">
                <div className="contacto-content content-width">
                    <h1>¿Quienes somos?</h1>
                    <span>Hola, somos una tienda ubicada en Ameghino 695, Pergamino, Buenos Aires. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ultricies ultricies vulputate. Nunc dapibus posuere eros, nec aliquam lacus congue vitae. Integer sollicitudin, nisi in tristique condimentum, eros urna malesuada leo, vel efficitur est risus vitae lacus. Praesent ut sem sed felis euismod consequat ut quis enim. Phasellus sit amet lorem rhoncus, malesuada dui nec, scelerisque arcu. </span>
                    <h1>¿Como contactarnos?</h1>
                    <div className="contacto-data">
                        <BgWithPlaceholder className="contacto-map">
                            <Tooltip title="Haz click para agrandar el mapa!" onClick={openMapOverlay}>
                                <img src={MapImageSrc}/>
                            </Tooltip>
                            <Overlay openState={mapOverlayOpen} centered={true} closeCallback={closeMapOverlay}>
                                <div className="contacto-map-overlay" id="google-map">
                                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3312.316142907874!2d-60.57786404867735!3d-33.881510927056226!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95b9caae8751ce5d%3A0xeb82183f25427954!2sBv.%20Ameghino%20695%2C%20Pergamino%2C%20Buenos%20Aires!5e0!3m2!1ses-419!2sar!4v1590372809218!5m2!1ses-419!2sar" width="100%" height="100%" aria-hidden="false"></iframe>
                                </div>
                            </Overlay>
                        </BgWithPlaceholder>
                        <ul>
                            <li><HomeIcon />Bv. Ameghino 695, Pergamino, Buenos Aires.</li>
                            <li><a href="https://facebook.com/LTiendadelbebe" target="_blank"><FacebookIcon />facebook.com/LTiendadelbebe</a></li>
                            <li><a href="mailto:hola@latiendadelbebe.com.ar"><EmailIcon />hola@latiendadelbebe.com.ar</a></li>
                            <li><a href="https://api.whatsapp.com/send?phone=+5492364206002" target="_blank"><PhoneIcon />2477 - 777777</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="contacto-footer">
                <Logo disableImage={true} inlineText={true} />
            </div>
        </div>
    );
}