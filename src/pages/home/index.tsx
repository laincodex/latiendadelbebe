import React from "react";
import "../../styles/app.scss";

import Header from "./components/header";
import Carousel from "./components/carousel";
import AboutUs from "./components/aboutus";
import NewProducts from "./components/newproducts";
import ProductList from "./components/productlist"

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
                <div style={{height: 100}}>{/* Temporal until footer exists */}</div>
            </div>
        );
    }
}