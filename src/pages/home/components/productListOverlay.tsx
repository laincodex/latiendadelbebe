import React, { useState, useRef, useEffect} from "react";
import Overlay from "./Overlay";
import { TProduct } from "../../../components/products";

import BreadcrumbsIcon from "../../../assets/icons/breadcrumbs.svg";
import CloseIcon from "../../../assets/icons/close.svg";
import ArrowBackIcon from "../../../assets/icons/arrow_left-24px.svg";

export default ({selectedProduct, productOverlayOpen, closeProductOverlay} : 
    {   selectedProduct :TProduct, 
        productOverlayOpen :boolean,
        closeProductOverlay :Function}) => {

    const MAX_PHOTOS :number = 5;
    const MAX_SIDE_PHOTOS :number = 2;

    const isOverlayDataLoaded = useRef<boolean>(false);
    useEffect(() => {
        // example data
        if (!isOverlayDataLoaded.current) {
            isOverlayDataLoaded.current = true;
            setThumbnailsData([
                "product-1.jpg",
                "product-2.jpg",
                "product-3.jpg",
                "product-4.jpg",
                "product-5.jpg",
                "product-6.jpg",
                "product-7.jpg",
            ]);
        }
    });

    const [thumbnailsData, setThumbnailsData] = useState<Array<string>>([]);
    const [currentPhoto, setCurrentPhoto] = useState<number>(1);

    const renderOverlayThumbnails = () :Array<JSX.Element> => {
        let renderedThumbnails :Array<JSX.Element> = [];

        let startIndex :number = 1;
        let endIndex = thumbnailsData.length;

        // To know how this work please go to Paginator component
        if (thumbnailsData.length > MAX_PHOTOS) {
            if (currentPhoto <= MAX_SIDE_PHOTOS) {
                endIndex = MAX_PHOTOS;
            } else {
                if(currentPhoto <= thumbnailsData.length - MAX_SIDE_PHOTOS) {
                    endIndex = currentPhoto + MAX_SIDE_PHOTOS;
                    if(currentPhoto > MAX_SIDE_PHOTOS) {
                        startIndex = currentPhoto - MAX_SIDE_PHOTOS;
                    }
                } else {
                    startIndex = thumbnailsData.length - (MAX_PHOTOS - 1)
                }
            }
        }

        for ( let i = startIndex; i <= endIndex; i++) {
            renderedThumbnails.push(
                <li 
                    key={i} 
                    className={(i == currentPhoto) ? "product-overlay-thumbnails-active" : ""}
                    style={{
                        backgroundImage: `url("/upload/products/${selectedProduct.id}/thumb_${thumbnailsData[i-1]}")` 
                    }}
                    onClick={goToImage(i)}
                ></li>
            );
        }
        return renderedThumbnails;
    }

    const goToImage = (imageNumber :number) => () => {
        setCurrentPhoto(imageNumber);
    }

    const movePhotoIndex = (next :boolean = true) => () => {
        if (next) {
            if (currentPhoto +1 <= thumbnailsData.length) {
                setCurrentPhoto(currentPhoto + 1);
            } else {
                setCurrentPhoto(1);
            }
        } else {
            if (currentPhoto -1 >= 1) {
                setCurrentPhoto(currentPhoto - 1);
            } else {
                setCurrentPhoto(thumbnailsData.length);
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
                        <span>{selectedProduct.title}</span>
                    </div>
                    <div className="flex-separator" onClick={closeProductOverlayHandler}></div>
                    <div className="product-overlay-exit" onClick={closeProductOverlayHandler}><CloseIcon className="svg-24" /></div>
                </div>
                <div className="product-overlay-body-container">
                    <div className="product-overlay-body">
                        <div className="product-overlay-gallery-container">
                            <div className="product-overlay-gallery">
                                <div className="product-overlay-nav">
                                    <div className="product-overlay-arrow" onClick={movePhotoIndex(false)}><ArrowBackIcon /></div>
                                    <div className="product-overlay-photo" style={{backgroundImage: `url("/upload/products/${selectedProduct.id}/previews/${thumbnailsData[currentPhoto-1]}")`}}></div>
                                    <div className="product-overlay-arrow" onClick={movePhotoIndex()}><ArrowBackIcon className="rotate-180" /></div>
                                </div>
                                <ul className="product-overlay-thumbnails">
                                    {renderOverlayThumbnails()}
                                </ul>
                            </div>
                        </div>
                        <article className="product-overlay-data">
                            <h1>{selectedProduct.title}</h1>
                            <p>{selectedProduct.description}</p>
                            <button className="main-btn">Preguntar</button>
                        </article>
                    </div>
                </div>
            </div>
        </Overlay>
    );
}