import React, { useState, useEffect, useRef } from "react";
import Tooltip from "../../home/components/Tooltip";
import { TBanner } from "../../../components/banners";

import AddIcon from "../../../assets/icons/baseline-add.svg";
import ArrowIcon from "../../../assets/icons/arrow_left-24px.svg";
import InserPhotoIcon from "../../../assets/icons/insert_photo-24px.svg";
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

    const [hasAnyChangesFlag, setHasAnyChangesFlag] = useState<boolean>(false);
    const [snackbarActive, setSnackbarActive] = useState<boolean>(false);

    // Create two copies of the source banners to handle new edits and cancel functionality
    const [banners, setBanners] = useState<TBanner[]>(sourceBanners.map(a => Object.assign({}, a)));
    const sourceBannersCopy = useRef<TBanner[]>(sourceBanners.map(a => Object.assign({}, a)));

    const renderBanners = () => {
        let renderedBanners :Array<JSX.Element> = [];
        banners.forEach((banner, index) => {
            renderedBanners.push(
                <li key={index}>
                    <div className="admin-banner-photo" style={{
                        backgroundImage: `url("/upload/carousel/${banner.image_url}")`
                    }}>
                        <input id={"edit-banner-label-"+index} className="admin-banner-label carousel-label" placeholder="Pon un texto o deja vacio para que no se muestre." onChange={handleChangeLabel(index)} value={banner.label}></input>
                    </div>
                    <div className="admin-banner-nav">
                        <ul>
                            <li className="admin-banner-moveup">
                                {(index > 0) ? <Tooltip title="Subir" style={tooltipStyle} onClick={moveBannerPosition(true, index)}><ArrowIcon className="rotate-90" /></Tooltip> : <><ArrowIcon className="rotate-90 admin-banner-disabled-icon" /></>}</li>
                            <li className="admin-banner-movedown">
                                {(index < banners.length-1) ? <Tooltip title="Bajar" style={tooltipStyle} onClick={moveBannerPosition(false, index)}><ArrowIcon className="rotate-270" /></Tooltip> : <ArrowIcon className="rotate-270 admin-banner-disabled-icon" />}</li>
                            <li className="admin-banner-upload">
                                <Tooltip title="Subir imagen" style={tooltipStyle} onClick={promptBannerUpload(index)}><InserPhotoIcon /></Tooltip>
                                <input type="file" id={"admin-banner-upload-"+index} onChange={uploadBanner(index)} />
                            </li>
                            <li className="admin-banner-remove">
                                <Tooltip title="Eliminar" style={tooltipStyle} onClick={removeBanner(index)}><RemoveIcon /></Tooltip>
                            </li>
                        </ul>
                    </div>
                </li>
            );
        });
        return renderedBanners;
    }

    const addBanner = () => {
        banners.unshift({
            image_url: "",
            id: 0,
            label:""
        });
        setHasAnyChangesFlag(true);
        setBanners([...banners]);
    }

    const handleChangeLabel = (bannerIndex :number) => (ev :any) => {
        setHasAnyChangesFlag(true);
        banners[bannerIndex].label = ev.target.value;
        setBanners([...banners]);
    }

    const moveBannerPosition = (up :boolean, index :number) => () => {
        const targetIndex = up ? index-1 : index+1;
        if (targetIndex >= 0 || targetIndex < banners.length) {
            setHasAnyChangesFlag(true);
            const temp :TBanner = banners[index];
            banners[index] = banners[targetIndex];
            banners[targetIndex] = temp;
            setBanners([...banners]);
        }
    }

    const promptBannerUpload = (index :number) => () => {
        document.getElementById("admin-banner-upload-"+index)?.click();
    }

    const uploadBanner = (index :number) => (ev :any) => {
        const file :File = ev.target.files[0];
        // const bannerImageForm = new FormData();
        // bannerImageForm.append("newImage", file, file.name);
        fetch("/admin/banners/upload", {
            method: 'POST',
            headers: {'Content-Type': "multipart/form-data"},
            body: file
        })  .then(res => res.json())
            .then(res => console.log(res));
    }
    
    const removeBanner = (index :number) => () => {
        if(confirm("Estas seguro de borrar el banner?")) {
            setHasAnyChangesFlag(true);
            banners.splice(index,1);
            setBanners([...banners]);
        }
    }

    const cancelChanges = () => {
        const restoredBanners = sourceBannersCopy.current.map(b => Object.assign({}, b));
        setHasAnyChangesFlag(false);
        setBanners([...restoredBanners]);
    }

    const submitBanners = (ev :any) => {
        fetch("/admin/banners",{
            method: 'POST',
            body: JSON.stringify({
                source: sourceBannersCopy.current,
                destination: banners
            }),
            headers: {
                'Content-Type':'application/json'
            }
        })
        .then(res => {
            console.log(res);
            setHasAnyChangesFlag(false);
            setSnackbarActive(true);
            sourceBannersCopy.current = banners.map(b => Object.assign({}, b));
            setTimeout(() =>{
                setSnackbarActive(false)}, 3000);
        })
        .catch(err => console.log(err));
    }

    return (
       <div className="admin-banners-container">
            <div className="admin-banners-add">
                <Tooltip title="Agregar un nuevo banner" style={{marginTop: 35}} onClick={addBanner}><AddIcon /></Tooltip>
            </div>
            <ul className="admin-banners-content">
                {renderBanners()}
            </ul>
            { hasAnyChangesFlag && <div className="admin-banners-savecancel-btns"><button className="main-btn" onClick={submitBanners}>GUARDAR CAMBIOS</button><button className="cancel-btn" onClick={cancelChanges}>CANCELAR</button></div>}
            <div id="admin-banners-snackbar" className={snackbarActive ? "admin-banners-snackbar-active" : undefined}>Se han guardado los cambios</div>
       </div>
   );
}