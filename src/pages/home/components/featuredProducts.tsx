import React, { useEffect, useState, useRef } from "react";
import SectionTitle from "./sectiontitle";
import ProductItem from "./productItem";
import { TProduct } from "../../../components/products";

import ArrowBackIcon from "../../../assets/icons/arrow_left-24px.svg"

const PRODUCTS_LIMIT = 4; //Maximum products to show on New Products

interface FeaturedProductsProps {
    featuredProducts : TProduct[]
};

export default ( { featuredProducts } : FeaturedProductsProps) => {
    const [renderedProducts, setRenderedProducts] = useState<Array<JSX.Element>>([]);
    const [sliceIndex, setSliceIndex] = useState<number>(0);
    
    const renderProducts = (products :TProduct[], index :number) :Array<JSX.Element> => {
        let renderedList : Array<JSX.Element> = [];
        let maxIndex = (index+PRODUCTS_LIMIT < products.length) ? index+PRODUCTS_LIMIT : products.length;
        for (let i = index; i < maxIndex; i++)
            renderedList.push(<li key={i}><ProductItem product={products[i]} onClick={openProduct(products[i].id)} /></li>);
        return renderedList;
    };

    // Change rendered products when either the list or the index changes
    useEffect(()=>{
        setRenderedProducts(renderProducts(featuredProducts, sliceIndex));
    }, [sliceIndex]);

    const nextSlice = (back :boolean) => () => {
        if (back) {
            if (sliceIndex > 0)
                setSliceIndex(sliceIndex-1);
        } else {
            if (sliceIndex +1 <= featuredProducts.length - PRODUCTS_LIMIT) {
                setSliceIndex(sliceIndex+1);
            }
        }
    }

    const isNavEnable = (back :boolean) => {
        let enable :boolean = false;
        if (back) {
            if (sliceIndex > 0)
                enable = true;
        } else {
            if (sliceIndex + PRODUCTS_LIMIT < featuredProducts.length)
                enable = true;
        }
        return enable ? "featured-products-nav-enable" : "";
    };

    const openProduct = (id :number) => () => {
        document.location.href = "/productos/" + id + "?ref=" + escape(document.location.pathname + document.location.search);
    };

    return (
        <div className="featured-products-container">
            <div className="featured-products-content">
                <SectionTitle title="PRODUCTOS DESTACADOS"/> 
                {(renderedProducts.length > 0 ) ?
                <div className="featured-products-nav">
                    <div className={"featured-products-nav-arrow " + isNavEnable(true)} onClick={nextSlice(true)}><ArrowBackIcon className="svg-24" /></div>
                    <ul className="featured-products-list">
                        {renderedProducts}
                    </ul>
                    <div className={"featured-products-nav-arrow " + isNavEnable(false)} onClick={nextSlice(false)}><ArrowBackIcon className="rotate-180 svg-24" /></div>
                </div> : <div className="featured-products-empty">No hay productos destacados</div>}
            </div>
        </div>
    );
};