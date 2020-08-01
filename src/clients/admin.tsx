import React from "react";
import ReactDOM from "react-dom";
import NotFoundPage from "../pages/404";
import AdminPage from "../pages/admin/index";
import AdminLogin from "../pages/admin/components/login";
import { BrowserRouter, Route, Switch } from "react-router-dom";

const initialProps = (window as any)._initialProps || {};

const App = () => (
    <BrowserRouter>
        <Switch>
            <Route path="/admin/login">{React.createElement(AdminLogin, initialProps)}</Route>
            <Route path="/admin">{React.createElement(AdminPage, initialProps)}</Route>
            <Route path="/404" exact={true}>{React.createElement(NotFoundPage, initialProps)}</Route>
        </Switch>
    </BrowserRouter>
);

ReactDOM.hydrate(<App />, document.getElementById("app"));