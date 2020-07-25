import React, { useState, useEffect } from "react";
import { TProduct, TProductImage, TCategory } from "../../../components/products";
import Overlay from "../../home/components/Overlay";

import ArrowBackIcon from "../../../assets/icons/arrow_back-24px.svg";
import BreadcrumbsIcon from "../../../assets/icons/breadcrumbs.svg";
import CheckOutlineIcon from "../../../assets/icons/check_circle_outline-24px.svg";
import HighlightOffIcon from "../../../assets/icons/highlight_off-24px.svg";
import StarIcon from "../../../assets/icons/star-24px.svg";
import CloseIcon from "../../../assets/icons/close.svg";
import FacebookIcon from "../../../assets/icons/f_logo_RGB-Blue_1024.svg";
import BgWithPlaceholder from "../../home/components/bgWithPlaceholder";

import { useIsFirstRender, StringUtils } from "../../Utils";

export interface ProductDetailProps {
    product :TProduct,
    productImages :TProductImage[],
    categories :TCategory[],
    refUrl :string
};

export default ({product, productImages, categories, refUrl} :ProductDetailProps) => {

    const MAX_PHOTOS :number = 5;
    const MAX_SIDE_PHOTOS :number = 2;

    const [currentPhoto, setCurrentPhoto] = useState<number>(productImages.length > 0 ? productImages.findIndex(i => i.id === product.primary_image_id) + 1 : 1);
    const [photoOverlayOpen, setPhotoOverlayOpen] = useState<boolean>(false);

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
                    className={(i == currentPhoto) ? "product-detail-thumbnails-active" : ""}
                    onClick={goToImage(i)}
                ><BgWithPlaceholder style={{
                        backgroundImage: `url("/upload/products/${product.id}/thumb_${getImage(i).image_url}")` 
                    }} /></li>
            );
        }
        return renderedThumbnails;
    };

    const renderCategories = () :JSX.Element[] => {
        const rendered :JSX.Element[] = [];
        const productCategories :number[] = JSON.parse(product.categories);
        productCategories.forEach((cat, index) => {
            const category = getCategory(cat);
            rendered.push(
                <li key={index} className="product-detail-category-item" onClick={goToCategory(category.id)}>
                    <span>{category.name.toUpperCase()}</span>
                </li>
            );
        });
        return rendered;
    };

    const getCategory = (id :number) => {
        const category = categories.find(c => c.id == id);
        if (!category)
            return {id: id, name: "categoria inexistente"};
        return category;
    };

    const goToCategory = (id :number) => () => {
        document.location.href = "/productos?category=" + id;
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

    const goToProductsPage = () => {
        document.location.href = "/productos";
    };

    const goBack = () => {
        document.location.href = refUrl;
    };

    const openPhotoOverlay = () => {
        setPhotoOverlayOpen(true);
    };

    const closePhotoOverlay = () => {
        setPhotoOverlayOpen(false);
    };

    const isFirstRender = useIsFirstRender();
    useEffect(() => {
        if (isFirstRender) {
            window.history.replaceState('productdetail','La Tienda del Bebe Producto', `/productos/${product.id}/${StringUtils.slugify(product.title)}${document.location.search}`);
        }
    }, []);

    const getImage = (position :number) => {
        if (productImages.length >= position) {
            return productImages[position - 1];
        } else {
            return { id: 0, product_id: product.id,  image_url: ""} as TProductImage;
        }
    };

    return (
        <div className="product-detail-container">
            <div className="product-detail-content">
                <div className="product-detail-topnav">
                    <div className="product-detail-goback btn-light-blue btn-icon-rotate360" onClick={goBack}><ArrowBackIcon /> Volver</div>
                    <div className="product-detail-breadcrumbs">
                        <span onClick={goToProductsPage}>Productos</span>
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
                                    <BgWithPlaceholder className="product-detail-photo" onClick={openPhotoOverlay} style={{backgroundImage: `url("/upload/products/${product.id}/thumb_${getImage(currentPhoto).image_url}")`}} />
                                    <div className="product-detail-arrow" onClick={movePhotoIndex()}><ArrowBackIcon className="rotate-180" /></div>
                                </div>
                                <ul className="product-detail-thumbnails">
                                    {renderOverlayThumbnails()}
                                </ul>
                            </div>
                        </div>
                        <article className="product-detail-data">
                            <div className="product-detail-data-stockfeature-container no-select">
                                {product.available ? <div className="product-detail-data-stock"><CheckOutlineIcon />EN STOCK</div>
                                : <div className="product-detail-data-nostock"><HighlightOffIcon />SIN STOCK</div>}
                                {product.is_featured ? <div className="product-detail-data-featured"><StarIcon /> PRODUCTO DESTACADO</div> : ""}
                            </div>
                            <p>{product.description}</p>
                            <div className="product-detail-categories">{renderCategories()}</div>
                            <button className="btn-light-blue btn-icon-rotate360"><FacebookIcon />Consultar</button>
                        </article>
                    </div>
                </div>
            </div>
            <Overlay openState={photoOverlayOpen} closeCallback={closePhotoOverlay} centered={true}>
                <div className="product-detail-photo-overlay">
                    <div className="product-detail-photo-overlay-content">
                        <div className="close-overlay-button" onClick={closePhotoOverlay}><CloseIcon /></div>
                        <img src={`/upload/products/${product.id}/${getImage(currentPhoto).image_url}`} />
                    </div>
                </div>
            </Overlay>
        </div>
    );
};