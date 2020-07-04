import React from "react";

import Header from "./components/header";
import Carousel from "./components/Carousel";
import AboutUs from "./components/aboutus";
import ProductList, { ProductListProps } from "./components/productlist";
import Footer from "./components/Footer";
import { TProduct, TCategory } from "../../components/products";
import { TCarouselItem } from "../../components/carousel";

export interface HomePageProps {
    carouselItems :TCarouselItem[],
};

export default ({carouselItems, ...props } : HomePageProps) => {
    return (
        <div className="app-container">
            <Header />
            <Carousel carouselItems={carouselItems} />
            <AboutUs />
            <ProductList {...props as ProductListProps} />
            <Footer />
        </div>
    );
}