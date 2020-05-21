import React, { useState, useRef, useEffect} from "react";
import Overlay from "./Overlay";
import { TProduct } from "./product";

import BreadcrumbsIcon from "../../../assets/icons/breadcrumbs.svg";
import CloseIcon from "../../../assets/icons/close.svg";
import ArrowBackIcon from "../../../assets/icons/arrow_left-24px.svg";

export default ({selectedProduct, productOverlayOpen, closeProductOverlay} : 
    {   selectedProduct :TProduct, 
        productOverlayOpen :boolean,
        closeProductOverlay :Function}) => {

    const isOverlayDataLoaded = useRef<boolean>(false);
    useEffect(() => {
        // example data
        if (!isOverlayDataLoaded.current) {
            isOverlayDataLoaded.current = true;
            setOverlayThumbnailsData([
                "product-1.jpg",
                "product-2.jpg",
                "product-3.jpg",
                "product-4.jpg",
                "product-5.jpg",
            ]);
        }
    });

    const [overlayThumbnailsData, setOverlayThumbnailsData] = useState<Array<string>>([]);
    const initialOverlayPhotoIndex = {
        start: 0,
        current: 0
    };
    const [overlayPhotoIndex, setOverlayPhotoIndex] = useState(initialOverlayPhotoIndex);

    const renderOverlayThumbnails = () :Array<JSX.Element> => {
        let renderedThumbnails :Array<JSX.Element> = [];
        let endIndex = (overlayPhotoIndex.start + 4 < overlayThumbnailsData.length) ? overlayPhotoIndex.start + 4 : overlayThumbnailsData.length;
        for ( let i = overlayPhotoIndex.start; i < endIndex; i++) {
            renderedThumbnails.push(
                <li key={i} className={(i == overlayPhotoIndex.current) ? "product-overlay-thumbnails-active" : ""}>{overlayThumbnailsData[i]}</li>
            );
        }
        return renderedThumbnails;
    }

    const moveOverlayPhotoIndex = (next :boolean = true) => () =>{
        if (next) {
            if (overlayPhotoIndex.current + 1 < overlayThumbnailsData.length) {
                setOverlayPhotoIndex({
                    start : overlayPhotoIndex.start + 1,
                    current: overlayPhotoIndex.current +1
                });
            } else {
                setOverlayPhotoIndex({
                    start: 0, current: 0
                });
            }
        } else {
            if (overlayPhotoIndex.current - 1 > 0) {
                setOverlayPhotoIndex({
                    start: overlayPhotoIndex.start - 1,
                    current: overlayPhotoIndex.current -1
                });
            } else {
                setOverlayPhotoIndex({
                    start: (overlayThumbnailsData.length - 4 >= 0) ? overlayThumbnailsData.length - 4 : overlayThumbnailsData.length -1,
                    current: overlayThumbnailsData.length-1
                });
            }
        }
    }

    const closeProductOverlayHandler = (ev:any) => {
        closeProductOverlay();
    }

    return (
        <Overlay openState={productOverlayOpen} closeCallback={closeProductOverlay}>
            <div className="product-overlay">
                <div className="product-overlay-topnav">
                    <div className="product-overlay-breadcrumbs no-select">
                        <span>Productos</span>
                        <BreadcrumbsIcon />
                        <span>{selectedProduct.name}</span>
                    </div>
                    <div className="flex-separator" onClick={closeProductOverlayHandler}></div>
                    <div className="product-overlay-exit" onClick={closeProductOverlayHandler}><CloseIcon className="svg-24" /></div>
                </div>
                <div className="product-overlay-body-container">
                    <div className="product-overlay-body">
                        <div className="product-overlay-gallery-container">
                            <div className="product-overlay-gallery">
                                <div className="product-overlay-main">
                                    <div className="product-overlay-arrow" onClick={moveOverlayPhotoIndex(false)}><ArrowBackIcon /></div>
                                    <div className="product-overlay-photo" style={{backgroundImage: `url("/upload/products/${selectedProduct.image}")`}}></div>
                                    <div className="product-overlay-arrow" onClick={moveOverlayPhotoIndex()}><ArrowBackIcon className="rotate-180" /></div>
                                </div>
                                <ul className="product-overlay-thumbnails">
                                    {renderOverlayThumbnails()}
                                </ul>
                            </div>
                        </div>
                        <article className="product-overlay-data">
                            <h1>{selectedProduct.name}</h1>
                            <p>{selectedProduct.description}</p>
                            <button>Preguntar</button>
                        </article>
                    </div>
                </div>
            </div>
        </Overlay>
    );
}