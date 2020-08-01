import React from "react";
import ReactDOM from "react-dom";
import HomePage from "../pages/home/index";
import NotFoundPage from "../pages/404";
import ProductsPage from "../pages/products";
import ContactPage from "../pages/contact";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "../styles/app.scss";

const initialProps = (window as any)._initialProps || {};

const App = () => (
    <BrowserRouter>
        <Switch>
            <Route path="/productos">{React.createElement(ProductsPage, initialProps)}</Route>
            <Route path="/contacto">{React.createElement(ContactPage, initialProps)}</Route>
            <Route path="/404" exact={true}>{React.createElement(NotFoundPage, initialProps)}</Route>
            <Route path="/">{React.createElement(HomePage, initialProps)}</Route>
        </Switch>
    </BrowserRouter>
);

ReactDOM.hydrate(<App />, document.getElementById("app"));