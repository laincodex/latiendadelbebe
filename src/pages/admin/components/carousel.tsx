import React, { useState, useEffect, useRef } from "react";
import Tooltip from "../../home/components/Tooltip";
import { TCarouselItem } from "../../../components/carousel";
import Snackbar, {SnackbarTime, SnackbarStyles} from "../../../components/Snackbar";
import Axios from "axios";

import AddIcon from "../../../assets/icons/baseline-add.svg";
import ArrowIcon from "../../../assets/icons/arrow_left-24px.svg";
import InserPhotoIcon from "../../../assets/icons/insert_photo-24px.svg";
import RemoveIcon from "../../../assets/icons/remove_circle-24px.svg";
import DoneIcon from "../../../assets/icons/done-24px.svg";
import CloseIcon from "../../../assets/icons/close.svg";
import LoadingCircle from "./LoadingCircle";

export interface CarouselProps {
    sourceCarouselItems :Array<TCarouselItem>
};

export default ( { sourceCarouselItems } :CarouselProps ) => {
    const tooltipStyle :React.CSSProperties = {
        width: 95,
        marginTop: 30,
        fontSize: 14
    }

    const [hasAnyChangesFlag, setHasAnyChangesFlag] = useState<boolean>(false);
    const [snackbarActive, setSnackbarActive] = useState<boolean>(false);
    const [snackbarErrorActive, setSnackbarErrorActive] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Create two copies of the source carousel items to handle new edits and cancel functionality
    const [carouselItems, setCarouselItems] = useState<TCarouselItem[]>(sourceCarouselItems.map(a => Object.assign({}, a)));
    const sourceCarouselItemsCopy = useRef<TCarouselItem[]>(sourceCarouselItems.map(a => Object.assign({}, a)));

    const renderCarouselItems = () => {
        let renderedCarouselItems :Array<JSX.Element> = [];
        carouselItems.forEach((carouselItem, index) => {
            renderedCarouselItems.push(
                <li key={index}>
                    <div className="admin-carousel-photo" style={{
                        backgroundImage: `url("/upload/carousel/${carouselItem.image_url}")`
                    }}>
                        <input id={"edit-carousel-label-"+index} className="admin-carousel-label carousel-label" placeholder="Pon un texto o deja vacio para que no se muestre." onChange={handleChangeLabel(index)} value={carouselItem.label}></input>
                    </div>
                    <div className="admin-carousel-nav">
                        <ul>
                            <li className="admin-carousel-moveup">
                                {(index > 0) ? <Tooltip title="Subir" style={tooltipStyle} onClick={moveCarouselItemPosition(true, index)}><ArrowIcon className="rotate-90" /></Tooltip> : <><ArrowIcon className="rotate-90 admin-carousel-disabled-icon" /></>}</li>
                            <li className="admin-carousel-movedown">
                                {(index < carouselItems.length-1) ? <Tooltip title="Bajar" style={tooltipStyle} onClick={moveCarouselItemPosition(false, index)}><ArrowIcon className="rotate-270" /></Tooltip> : <ArrowIcon className="rotate-270 admin-carousel-disabled-icon" />}</li>
                            <li className="admin-carousel-upload">
                                <Tooltip title="Subir imagen" style={tooltipStyle} onClick={promptImageUpload(index)}><InserPhotoIcon /></Tooltip>
                            </li>
                            <li className="admin-carousel-remove">
                                <Tooltip title="Eliminar" style={tooltipStyle} onClick={removeCarouselItem(index)}><RemoveIcon /></Tooltip>
                            </li>
                        </ul>
                    </div>
                </li>
            );
        });
        return renderedCarouselItems;
    }

    const addCarouselItem = () => {
        carouselItems.unshift({
            image_url: "",
            id: 0,
            label:""
        });
        setHasAnyChangesFlag(true);
        setCarouselItems([...carouselItems]);
    }

    const handleChangeLabel = (carouselItemIndex :number) => (ev :any) => {
        setHasAnyChangesFlag(true);
        carouselItems[carouselItemIndex].label = ev.target.value;
        setCarouselItems([...carouselItems]);
    }

    const moveCarouselItemPosition = (up :boolean, index :number) => () => {
        const targetIndex = up ? index-1 : index+1;
        if (targetIndex >= 0 || targetIndex < carouselItems.length) {
            setHasAnyChangesFlag(true);
            const temp :TCarouselItem = carouselItems[index];
            carouselItems[index] = carouselItems[targetIndex];
            carouselItems[targetIndex] = temp;
            setCarouselItems([...carouselItems]);
        }
    }

    const uploadImageIndex = useRef<number>(0);

    const promptImageUpload = (index :number) => () => {
        uploadImageIndex.current = index;
        document.getElementById("admin-carousel-upload-image")?.click();
    }

    const uploadImageOnChange = (ev :any) => {
        const file :File = ev.target.files[0];
        const data :FormData = new FormData();
        data.append('carouselImage', file);
        // we need to clear the input value to have onChange working correctly for newer uploads
        (document.getElementById("admin-carousel-upload-image") as HTMLInputElement).value = "";

        setIsLoading(true);
        Axios.post("/admin/carousel/upload", data).then(res => {
            if (res.data.tmpImagePath) {
                carouselItems[uploadImageIndex.current].image_url = "tmp/" + res.data.tmpImagePath;
                setHasAnyChangesFlag(true);
                setCarouselItems([...carouselItems]);
                setIsLoading(false);
            }
        })
        .catch(err => {
            setIsLoading(false);
            activeErrorSnackbar();
            console.log(err);
        });
    }
    
    const removeCarouselItem = (index :number) => () => {
        if(confirm("Estas seguro de borrar?")) {
            setHasAnyChangesFlag(true);
            carouselItems.splice(index,1);
            setCarouselItems([...carouselItems]);
        }
    }

    const cancelChanges = () => {
        const restoredCarousel = sourceCarouselItemsCopy.current.map(b => Object.assign({}, b));
        setHasAnyChangesFlag(false);
        setCarouselItems([...restoredCarousel]);
    }

    const submitCarouselItems = (ev :any) => {
        Axios.post("/admin/carousel", {
            data: {
                source: sourceCarouselItemsCopy.current,
                destination: carouselItems
            }
        })
        .then(res => {
            const updatedCarousel :TCarouselItem[] = res.data;
            sourceCarouselItemsCopy.current = updatedCarousel.map(item => Object.assign({}, item));
            activeSuccessSnackbar();
            setHasAnyChangesFlag(false);
            setCarouselItems(updatedCarousel.map(item => Object.assign({}, item)));
            
        })
        .catch(err => {
            activeErrorSnackbar();
            console.log(err);
        });
    }

    const activeSuccessSnackbar = () => {
        setSnackbarActive(true);
        setTimeout(() => setSnackbarActive(false), SnackbarTime);
    };

    const activeErrorSnackbar = () => {
        setSnackbarErrorActive(true);
        setTimeout(() => setSnackbarErrorActive(false), SnackbarTime);
    };

    return (
       <div className="admin-carousel-container">
            <div className="admin-nav-add">
                <Tooltip title="Agregar un nuevo item al carousel" style={{marginTop: 35}} onClick={addCarouselItem}><AddIcon /></Tooltip>
            </div>
            <ul className="admin-carousel-content">
                {renderCarouselItems()}
            </ul>
            {hasAnyChangesFlag && <div className="admin-carousel-savecancel-btns">
                <button className="btn-light-blue btn-icon-rotate360" onClick={submitCarouselItems}><DoneIcon />GUARDAR CAMBIOS</button>
                <button className="btn-light-red" onClick={cancelChanges}><CloseIcon />CANCELAR</button>
            </div>}
            <Snackbar type={SnackbarStyles.SUCCESS} message="Se han guardado los cambios" isActive={snackbarActive} />
            <Snackbar type={SnackbarStyles.ERROR} message="Hubo un error, por favor recarga la pagina." isActive={snackbarErrorActive} />
            <LoadingCircle openState={isLoading} />
            <input type="file" id={"admin-carousel-upload-image"} onChange={uploadImageOnChange} />
       </div>
   );
}