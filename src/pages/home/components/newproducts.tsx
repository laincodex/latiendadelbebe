import React, { useEffect, useState, useRef } from "react";
import SectionTitle from "./sectiontitle";
import Product, {TProduct} from "./product";

import ArrowBackIcon from "../../../assets/icons/arrow_left-24px.svg"

const PRODUCTS_LIMIT = 4; //Maximum products to show on New Products

export default () => {
    const [renderedProducts, setRenderedProducts] = useState<Array<JSX.Element>>([]);
    const [sliceIndex, setSliceIndex] = useState<number>(0);
    const [products, setProducts] = useState<Array<TProduct>>([]);
    //const [isProductsLoaded, setProductsLoaded] = useState<boolean>(false);
    
    const renderProducts = (products :Array<TProduct>, index :number) :Array<JSX.Element> => {
        let renderedList : Array<JSX.Element> = [];
        let maxIndex = (index+PRODUCTS_LIMIT < products.length) ? index+PRODUCTS_LIMIT : products.length;
        for (let i = index; i < maxIndex; i++)
            renderedList.push(<li key={i}><Product product={products[i]}/></li>);
        return renderedList;
    };

    // Change rendered products when either the list or the index changes
    useEffect(()=>{
        setRenderedProducts(renderProducts(products, sliceIndex));
    }, [products, sliceIndex]);

    const isProductsLoaded = useRef<boolean>(false);
    useEffect(()=> {
        // fake load products from db
        if (!isProductsLoaded.current) {
            isProductsLoaded.current = true;
            setProducts([
                {
                    id: 1,
                    name: "Product 1",
                    image: "product-1.jpg",
                    title: "Product 1 long title example",
                    description: "this is product 1"
                },{
                    id: 1,
                    name: "Product 2",
                    image: "product-2.jpg",
                    title: "Product 2 title",
                    description: "this is product 2"
                },{
                    id: 1,
                    name: "Product 3",
                    image: "product-2.jpg",
                    title: "Product 3 title",
                    description: "this is product 2"
                },{
                    id: 1,
                    name: "Product 4",
                    image: "product-2.jpg",
                    title: "Product 4 title",
                    description: "this is product 2"
                },{
                    id: 1,
                    name: "Product 5",
                    image: "product-2.jpg",
                    title: "Product 5 title",
                    description: "this is product 2"
                },{
                    id: 1,
                    name: "Product 6",
                    image: "product-2.jpg",
                    title: "Product 6 title",
                    description: "this is product 2"
                }
            ]);
        }
    });

    const nextSlice = (back :boolean) => () => {
        if (back) {
            if (sliceIndex > 0)
                setSliceIndex(sliceIndex-1);
        } else {
            if (sliceIndex +1 <= products.length - PRODUCTS_LIMIT) {
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
            if (sliceIndex + PRODUCTS_LIMIT < products.length)
                enable = true;
        }
        return enable ? "new-products-nav-enable" : "";
    }

    return (
        <div className="new-products-container">
            <div className="new-products-content">
                <SectionTitle title="NUEVOS PRODUCTOS"/>
                <div className="new-products-nav">
                    <div className={"new-products-nav-arrow " + isNavEnable(true)} onClick={nextSlice(true)}><ArrowBackIcon className="svg-24" /></div>
                    <ul className="new-products-list">
                        {(renderedProducts.length > 0 ) ? renderedProducts : "loading..."}
                    </ul>
                    <div className={"new-products-nav-arrow " + isNavEnable(false)} onClick={nextSlice(false)}><ArrowBackIcon className="rotate-180 svg-24" /></div>
                </div>
            </div>
        </div>
    );
};