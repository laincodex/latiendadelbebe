import React from "react";
import "../../styles/app.scss";

import Header from "./components/header";
import Carousel from "./components/Carousel";
import AboutUs from "./components/aboutus";
import NewProducts from "./components/newproducts";
import ProductList from "./components/productlist";
import Footer from "./components/Footer";

export default class Home extends React.Component {
    constructor(props :any) {
        super(props);
    }

    render() {
        return (
            <div className="app-container">
                <Header />
                <Carousel />
                <AboutUs />
                <NewProducts />
                <ProductList />
                <Footer />
            </div>
        );
    }
}