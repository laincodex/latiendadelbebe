import React, { useEffect, useState } from "react";
import SectionTitle from "./sectiontitle";
import Product, {TProduct} from "./product";


export default () => {

    const [productList, setProductList] = useState<Array<JSX.Element>>([]);
    
    const renderProducts = (products :Array<TProduct>) :Array<JSX.Element> => {
        let renderedList : Array<JSX.Element> = [];
        products.map((p, key) => renderedList.push(<li key={key}><Product product={p}/></li>));
        return renderedList;
    };
    
    useEffect(()=>{

       const products :Array<TProduct> = [
           {
                name: "Product 1",
                image: "product-1.jpg",
                title: "Product 1 long title example",
                description: "this is product 1"
            },{
                name: "Product 2",
                image: "product-2.jpg",
                title: "Product 2 title",
                description: "this is product 2"
            }
        ];

        setProductList(renderProducts(products));


    },[]);

    return (
        <div className="new-products-container">
            <div className="new-products-content">
                <SectionTitle title="NUEVOS PRODUCTOS"/>
                <ul className="new-products-list">
                    {(productList.length > 0 ) ? productList : "loading..."}
                </ul>
            </div>
        </div>
    );
};