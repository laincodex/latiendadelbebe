import React from "react";
import { renderToString } from "react-dom/server";
import express, { Application } from "express";
import http from "http";

const app :Application = express();
const server : http.Server = http.createServer(app);
import HtmlTemplate from "./components/HtmlTemplate";

import HomePage from "./pages/home";
import ProductsPage from "./pages/products";
import AdminPage from "./pages/admin";

import { TProduct } from "./pages/home/components/product";

app.use((req, res, next) => {
    try {
        decodeURIComponent(req.path);
    } catch(e) {
        return res.redirect("/error");
    }
    next();
});
app.use(express.static("dist"));
app.use(express.json());


app.get("/", (req, res) => {
    res.send(HtmlTemplate({
        content: renderToString(React.createElement(HomePage)),
        props: '""',
        head: "<title>La Tienda del BEBE</title>"
    }));
});

app.get("/products/:productId?", (req, res) => {
    const props = {
        productId: parseInt(req.params.productId, 10) || 0,
        products: [],
    };
    res.send(HtmlTemplate({
        content: renderToString(React.createElement(ProductsPage, props)),
        props: JSON.stringify(props),
        head: "<title>La Tienda del BEBE - Productos</title>"
    }));
});

app.get("/admin", (req, res) => {
    res.send(HtmlTemplate({
        content: renderToString(React.createElement(AdminPage)),
        props: '""',
        head: "<title>La Tienda del BEBE - Panel del administrador</title>"
    }));
});

server.listen( process.env.PORT || 5000, () => console.log("Running..."))