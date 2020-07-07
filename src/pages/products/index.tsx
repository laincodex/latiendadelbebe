import React from "react";

import Header from "../home/components/header";
import ProductDetail, { ProductDetailProps } from "../products/components/productDetail";
import ProductList, { ProductListProps } from "../home/components/productlist";
import Footer from "../home/components/Footer";

interface Props {
    isProductPage :boolean
}
export default ({ isProductPage = false, ...props} : Props) => {
    return (
        <div className="app-container">
            <Header />
            {(isProductPage) ? <ProductDetail {...props as ProductDetailProps} /> : <ProductList {...props as ProductListProps} /> }
            <Footer />
        </div>
    );
}