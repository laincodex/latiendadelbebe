import React, { useState } from "react";
import Tooltip from "../../home/components/Tooltip";
import { TBanner } from "../../../components/banners";

import AddIcon from "../../../assets/icons/baseline-add.svg";
import ArrowIcon from "../../../assets/icons/arrow_left-24px.svg";
import EditTextIcon from "../../../assets/icons/title-24px.svg";
import RemoveIcon from "../../../assets/icons/remove_circle-24px.svg";

export interface BannersProps {
    sourceBanners :Array<TBanner>
};

export default ( { sourceBanners } :BannersProps ) => {
    const tooltipStyle :React.CSSProperties = {
        width: 85,
        marginTop: 30,
        fontSize: 14
    }

    // Create a copy of the source banners to a state
    const [banners, setBanners] = useState<TBanner[]>(sourceBanners.map(a => Object.assign({}, a)));

    const renderBanners = () => {
        let renderedBanners :Array<JSX.Element> = [];
        banners.forEach((banner, index) => {
            renderedBanners.push(
                <li key={index}>
                    <div className="admin-banner-photo" style={{
                        backgroundImage: `url("/upload/carousel/${banner.image_url}")`
                    }}>
                        <input className="admin-banner-label" placeholder={banner.label} onChange={handleChangeLabel(index)}></input>
                    <div>{banner.label}</div>
                    </div>
                    <div className="admin-banner-nav">
                        <ul>
                            <li className="admin-banner-moveup">
                                <Tooltip title="Subir" style={tooltipStyle}><ArrowIcon className="rotate-90" /></Tooltip></li>
                            <li className="admin-banner-movedown">
                                <Tooltip title="Bajar" style={tooltipStyle}><ArrowIcon className="rotate-270" /></Tooltip></li>
                            <li className="admin-banner-edittext">
                                <Tooltip title="Editar texto" style={tooltipStyle}><EditTextIcon /></Tooltip></li>
                            <li className="admin-banner-remove">
                                <Tooltip title="Eliminar" style={tooltipStyle}><RemoveIcon /></Tooltip>
                            </li>
                        </ul>
                    </div>
                </li>
            );
        });
        return renderedBanners;
    }

    const handleChangeLabel = (bannerIndex :number) => (ev :any) => {
        banners[bannerIndex].label = ev.target.value;
        setBanners([...banners]);
    }

    const submitBanners = (ev :any) => {
        const tuvieja = JSON.stringify({
                source: sourceBanners,
                destination: banners
            });
        fetch("/admin/banners",{
            method: 'POST',
            body: tuvieja,
            headers: {
                'Content-Type':'application/json'
            }
        })
        .then(res => {
            console.log(res);
        })
        .catch(err => console.log(err));
    }
    
    return (
       <div className="admin-banners-container">
            <div className="admin-banners-add">
                <Tooltip title="Agregar un nuevo banner" style={{marginTop: 35}}><AddIcon /></Tooltip>
            </div>
            <ul className="admin-banners-content">
                {renderBanners()}
            </ul>
            <button className="main-btn" onClick={submitBanners}>save</button>
       </div>
   );
}