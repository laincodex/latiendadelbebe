import React from "react";
import { renderToString } from "react-dom/server";
import express, { Application, Request, Response, NextFunction } from "express";
//import bodyparser from "body-parser";
import cookieparser from "cookie-parser";
import http from "http";
import jwt from "jsonwebtoken";
import sqlite3 from "sqlite3";
import { open as openDatabase, Database} from "sqlite";

const app :Application = express();
const server : http.Server = http.createServer(app);
import HtmlTemplate from "./components/HtmlTemplate";

import HomePage from "./pages/home";
import ProductsPage from "./pages/products";
import AdminPage from "./pages/admin";
import AdminLogin from "./pages/admin/components/login";

import * as Banners from "./components/banners";


const database = openDatabase({
    filename: "database.db",
    driver: sqlite3.Database
});

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

app.get("/admin/banners", adminOnly, async (req :Request, res :Response) => {
    try {
        const db :Database = await database;
        Banners.getBanners(db)
        .then(banners => {
            const props = {
                section: "banners",
                sourceBanners: banners,
            };
            renderAdminTemplate(props, res);
        })
        .catch(err => res.send(err));
    } catch(err) {res.send(err);}
});

app.get("/admin/banners/new", adminOnly, (req :Request, res :Response) => {
    const source :Banners.TBanner[] = [];
    const dest :Banners.TBanner[] = [];

    source.push({id: 1, image_url: "hola.png", label: "asdasdasd"});
    source.push({id: 2, image_url: "asd.png", label: "eeeee"});
    dest.push({id: 1, image_url: "nueva foto.png", label: "nuevo label"});
    dest.push({id: 0, image_url: "tuvieja.png", label: "jejeje"});
})
app.post("/admin/banners", adminOnly, async (req :Request, res :Response) => {
    const db :Database = await database;
    Banners.updateBanners(db, req.body.source, req.body.destination)
        .then(() => {
            res.sendStatus(200);
        })
        .catch(err => {
            res.status(500).send(err);
        });
});

app.get("/404", (req :Request, res :Response) => {
    res.send("Not found lol");
});

app.get("*", (req :Request, res :Response) => res.redirect("/404"));

server.listen( process.env.PORT || 5000, () => console.log("Running..."))