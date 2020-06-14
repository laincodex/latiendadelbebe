import React from "react";

import Header from "./components/header";
import Carousel from "./components/Carousel";
import AboutUs from "./components/aboutus";
import ProductList from "./components/productlist";
import Footer from "./components/Footer";
import { TProduct } from "./components/product";

interface Props {
    productId :number,
    products :Array<TProduct>
}

export default ({ productId, products = [] } : Props) => {
    return (
        <div className="app-container">
            <Header />
            <Carousel />
            <AboutUs />
            <ProductList newProductsEnabled={true} products={products} productId={productId}/>
            <Footer />
        </div>
    );
}