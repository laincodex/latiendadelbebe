import React from "react";
import ReactDOM from "react-dom";
import HomePage from "./pages/home";
import ProductsPage from "./pages/products";
import AdminPage from "./pages/admin";
import { BrowserRouter, Route, Switch } from "react-router-dom";

const initialProps = (window as any)._initialProps || {};

const App = () => (
    <BrowserRouter>
        <Switch>
            <Route path="/products">{React.createElement(ProductsPage, initialProps)}</Route>
            <Route path="/admin">{React.createElement(AdminPage, initialProps)}</Route>
            <Route path="/">{React.createElement(HomePage, initialProps)}</Route>
        </Switch>
    </BrowserRouter>
);

ReactDOM.hydrate(<App />, document.getElementById("app"));