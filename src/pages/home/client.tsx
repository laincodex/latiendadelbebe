import React from "react";
import ReactDOM from "react-dom";
import HomePage from "./index";
import NotFoundPage from "../404";
import ProductsPage from "../products";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "../../styles/app.scss";

const initialProps = (window as any)._initialProps || {};

const App = () => (
    <BrowserRouter>
        <Switch>
            <Route path="/productos">{React.createElement(ProductsPage, initialProps)}</Route>
            <Route path="/404" exact={true}>{React.createElement(NotFoundPage, initialProps)}</Route>
            <Route path="/">{React.createElement(HomePage, initialProps)}</Route>
        </Switch>
    </BrowserRouter>
);

ReactDOM.hydrate(<App />, document.getElementById("app"));