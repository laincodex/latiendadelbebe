import React from "react";
import Tooltip from "../../home/components/Tooltip";

import AddIcon from "../../../assets/icons/baseline-add.svg";
import ArrowIcon from "../../../assets/icons/arrow_left-24px.svg";
import EditTextIcon from "../../../assets/icons/title-24px.svg";
import RemoveIcon from "../../../assets/icons/remove_circle-24px.svg";

export default () => {
    const tooltipStyle :React.CSSProperties = {
        marginLeft: -50,
        width: 90,
        marginTop: 30,
        fontSize: 14
    }
    
    return (
       <div className="admin-banners-container">
            <div className="admin-banners-add">
                <Tooltip title="Agregar un nuevo banner" style={{marginTop: 35, marginLeft: 0}}><AddIcon /></Tooltip>
            </div>
            <ul className="admin-banners-content">
                <li>
                    <div className="admin-banner-photo"></div>
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
            </ul>
       </div>
   );
}