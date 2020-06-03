import React from "react";
import { renderToString } from "react-dom/server";
import express, { Application, Request, Response, NextFunction } from "express";
//import bodyparser from "body-parser";
import cookieparser from "cookie-parser";
import http from "http";
import jwt from "jsonwebtoken";

const app :Application = express();
const server : http.Server = http.createServer(app);
import HtmlTemplate from "./components/HtmlTemplate";

import HomePage from "./pages/home";
import ProductsPage from "./pages/products";
import AdminPage from "./pages/admin";
import AdminLogin from "./pages/admin/components/login";

import { TProduct } from "./pages/home/components/product";

app.use(cookieparser());

app.use(express.static("dist"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.set("jwt-secret", "6x7fSQ7z6JXDDfBa6Lrdozrd9rHK")

app.get("/", (req, res) => {
    res.send(HtmlTemplate({
        content: renderToString(React.createElement(HomePage)),
        props: '""',
        head: "<title>La Tienda del BEBE</title>"
    }));
});

app.get("/productos/:productId?", (req, res) => {
    let props = {
        productId: parseInt(req.params.productId, 10) || 0,
        products: [],
    };
    res.send(HtmlTemplate({
        content: renderToString(React.createElement(ProductsPage, props)),
        props: JSON.stringify(props),
        head: "<title>La Tienda del BEBE - Productos</title>"
    }));
});

const adminOnly = (req :Request, res :Response, next :NextFunction) => {
    const token = req.cookies.token;
    if (token) {
        jwt.verify(token, app.get("jwt-secret"), (err :any) => {
            if (err) {
                res.clearCookie("token");
                res.redirect("/admin/login");
            }
            next();
        }); 
    } else {
        res.clearCookie("token");
        res.redirect("/admin/login");
    }
}

app.get("/admin/login", (req :Request, res :Response) => {
    const token = req.cookies.token;
    if (!token) {
        res.send(HtmlTemplate({
            content: renderToString(React.createElement(AdminLogin)),
            props: '""',
            head: "<title>La Tienda del BEBE - Panel del administrador - Login</title>"
        }));
    } else {
        res.redirect("/admin");
    }
});

app.post("/admin/login", (req :Request, res :Response) => {
    if(req.body.username == "admin" && req.body.password == "admin") {
        const token = jwt.sign( {username: "admin"}, app.get("jwt-secret"), {
            algorithm: "HS256",
            expiresIn: '30m'
        });
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: true,
            //secure: true,
            maxAge: 1800*1000
        })
        res.redirect("/admin");
    } else {
        let props = {
            error: "Usuario y/o contraseña incorrectos."
        };
        res.send(HtmlTemplate({
            content: renderToString(React.createElement(AdminLogin, props)),
            props: JSON.stringify(props),
            head: "<title>La Tienda del BEBE - Panel del administrador - Login</title>"
        }));
    }
});

app.get("/admin/logout", (req :Request, res :Response) => {
    res.clearCookie("token");
    res.redirect("/admin");
})

const renderAdminTemplate = (props :any, res :Response) => {
    res.send(HtmlTemplate({
        content: renderToString(React.createElement(AdminPage, props)),
        props: JSON.stringify(props),
        head: "<title>La Tienda del BEBE - Panel del administrador</title>"
    }));
}

app.get("/admin", adminOnly ,(req :Request, res :Response) => res.redirect("/admin/productos"));

app.get("/admin/productos", adminOnly, (req :Request, res :Response) => {
    const props = {
        section: "productos"
    };
    renderAdminTemplate(props, res);
});

app.get("/admin/banners", adminOnly, (req :Request, res :Response) => {
    const props = {
        section: "banners"
    };
    renderAdminTemplate(props, res);
});

app.get("/404", (req :Request, res :Response) => {
    res.send("Not found lol");
});

app.get("*", (req :Request, res :Response) => res.redirect("/404"));

server.listen( process.env.PORT || 5000, () => console.log("Running..."))