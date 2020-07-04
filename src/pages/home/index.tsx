import React from "react";

import Header from "./components/header";
import Carousel from "./components/Carousel";
import AboutUs from "./components/aboutus";
import ProductList from "./components/productlist";
import Footer from "./components/Footer";
import { TProduct, TCategory } from "../../components/products";
import { TCarouselItem } from "../../components/carousel";

export interface HomePageProps {
    products :TProduct[],
    carouselItems :TCarouselItem[],
    featuredProducts :TProduct[],
    categories :TCategory[]
};

export default ({ products, carouselItems, featuredProducts, categories } : HomePageProps) => {
    return (
        <div className="app-container">
            <Header />
            <Carousel carouselItems={carouselItems} />
            <AboutUs />
            <ProductList featuredProducts={featuredProducts} products={products} categories={categories} />
            <Footer />
        </div>
    );
}