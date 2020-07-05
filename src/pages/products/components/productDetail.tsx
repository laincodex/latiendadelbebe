import React, { useState } from "react";
import { TProduct, TProductImage } from "../../../components/products";

import ArrowBackIcon from "../../../assets/icons/arrow_back-24px.svg";
import BreadcrumbsIcon from "../../../assets/icons/breadcrumbs.svg";

export interface ProductDetailProps {
    product :TProduct,
    productImages :TProductImage[]
};

export default ({product, productImages} :ProductDetailProps) => {

    const MAX_PHOTOS :number = 5;
    const MAX_SIDE_PHOTOS :number = 2;

    const [currentPhoto, setCurrentPhoto] = useState<number>(1);

    const renderOverlayThumbnails = () :Array<JSX.Element> => {
        let renderedThumbnails :Array<JSX.Element> = [];

        let startIndex :number = 1;
        let endIndex = productImages.length;

        // To know how this work please go to Paginator component
        if (productImages.length > MAX_PHOTOS) {
            if (currentPhoto <= MAX_SIDE_PHOTOS) {
                endIndex = MAX_PHOTOS;
            } else {
                if(currentPhoto <= productImages.length - MAX_SIDE_PHOTOS) {
                    endIndex = currentPhoto + MAX_SIDE_PHOTOS;
                    if(currentPhoto > MAX_SIDE_PHOTOS) {
                        startIndex = currentPhoto - MAX_SIDE_PHOTOS;
                    }
                } else {
                    startIndex = productImages.length - (MAX_PHOTOS - 1)
                }
            }
        }

        for ( let i = startIndex; i <= endIndex; i++) {
            renderedThumbnails.push(
                <li 
                    key={i} 
                    className={(i == currentPhoto) ? "product-overlay-thumbnails-active" : ""}
                    style={{
                        backgroundImage: `url("/upload/products/${product.id}/thumb_${productImages[i-1].image_url}")` 
                    }}
                    onClick={goToImage(i)}
                ></li>
            );
        }
        return renderedThumbnails;
    };

    const goToImage = (imageNumber :number) => () => {
        setCurrentPhoto(imageNumber);
    };

    const movePhotoIndex = (next :boolean = true) => () => {
        if (next) {
            if (currentPhoto +1 <= productImages.length) {
                setCurrentPhoto(currentPhoto + 1);
            } else {
                setCurrentPhoto(1);
            }
        } else {
            if (currentPhoto -1 >= 1) {
                setCurrentPhoto(currentPhoto - 1);
            } else {
                setCurrentPhoto(productImages.length);
            }
        }
    };


    return (<div className="product-detail">
    <div className="product-detail-topnav">
        <div className="product-detail-breadcrumbs no-select">
            <span>Productos</span>
            <BreadcrumbsIcon />
            <span>{product.title}</span>
        </div>
    </div>
    <div className="product-detail-body-container">
        <div className="product-detail-body">
            <div className="product-detail-gallery-container">
                <div className="product-detail-gallery">
                    <div className="product-detail-nav">
                        <div className="product-detail-arrow" onClick={movePhotoIndex(false)}><ArrowBackIcon /></div>
                        <div className="product-detail-photo" style={{backgroundImage: `url("/upload/products/${product.id}/thumb_${productImages[currentPhoto-1].image_url}")`}}></div>
                        <div className="product-detail-arrow" onClick={movePhotoIndex()}><ArrowBackIcon className="rotate-180" /></div>
                    </div>
                    <ul className="product-overlay-thumbnails">
                        {renderOverlayThumbnails()}
                    </ul>
                </div>
            </div>
            <article className="product-overlay-data">
                <h1>{product.title}</h1>
                <p>{product.description}</p>
                <button className="main-btn">Preguntar</button>
            </article>
        </div>
    </div>
</div>);
};