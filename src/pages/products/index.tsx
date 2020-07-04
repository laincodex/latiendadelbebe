import React from "react";
import "../../styles/app.scss";

import Header from "../home/components/header";
import ProductList from "../home/components/productlist";
import Footer from "../home/components/Footer";

import { TProduct } from "../../components/products";

interface Props {
    productId : number,
    products : Array<TProduct>
}
export default ({ productId = 0, products = []} : Props) => {
    return (
        <div className="app-container">
            <Header />
            {/* <ProductList featuredProductsEnabled={false} showSectionTitle={false} maxListedProducts={12} productId={productId} products={products} /> */}
            <Footer />
        </div>
    );
}