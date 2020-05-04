import React from "react";
import "../../styles/app.scss";

import Header from "./components/header";
import Carousel from "./components/carousel";

export default class Home extends React.Component {
    constructor(props :any) {
        super(props);
    }

    render() {
        return (
            <div className="app-container">
                <Header />
                <Carousel />
            </div>
        );
    }
}