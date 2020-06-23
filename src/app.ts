import React from "react";
import { renderToString } from "react-dom/server";
import express, { Application, Request, Response, NextFunction } from "express";
import fs from "fs";
import multyparty from "multiparty";
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

import * as Carousel from "./components/carousel";
import * as Products from "./components/products";

import { getRefUrl, StringUtils } from "./pages/Utils";

const database = openDatabase({
    filename: "database.db",
    driver: sqlite3.Database
});

app.use(cookieparser());

app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
app.set("jwt-secret", "6x7fSQ7z6JXDDfBa6Lrdozrd9rHK");

// const
const carouselImagesTmpPath = __dirname + "/public/upload/carousel/tmp";
const ADMIN_PRODUCTS_PER_PAGE = 10;

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
                res.clearCookie("token").status(401).redirect("/admin/login?ref=" + escape(req.url));
            } else {
                next();
            }
        }); 
    } else {
        res.clearCookie("token").status(401).redirect("/admin/login?ref=" + escape(req.url));
    }
}

app.get("/admin/login", (req :Request, res :Response) => {
    const token = req.cookies.token;
    const refUrl = getRefUrl(req, "/admin");
    if (!token) {
        const props = {
            error: undefined,
            refUrl: refUrl
        };
        res.send(HtmlTemplate({
            content: renderToString(React.createElement(AdminLogin, props)),
            props: JSON.stringify(props),
            head: "<title>La Tienda del BEBE - Panel del administrador - Login</title>"
        }));
    } else {
        res.redirect(refUrl);
    }
});

app.post("/admin/login", (req :Request, res :Response) => {
    const refUrl = getRefUrl(req, "/admin");
    if(req.body.username == "admin" && req.body.password == "admin") {
        const token = jwt.sign( {username: "admin"}, app.get("jwt-secret"), {
            algorithm: "HS256",
            expiresIn: '30m'
        });
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: true,
            //secure: true,
            maxAge: 3600*1000
        });
        res.redirect(refUrl);
    } else {
        let props = {
            error: "Usuario y/o contraseña incorrectos.",
            refUrl: refUrl
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

app.get("/admin/productos(/page?/:page?)?", adminOnly, async (req :Request, res :Response) => {
    try {
        const searchName = StringUtils.sanitizeString(req.query.name as string);
        const filter = StringUtils.sanitizeString(req.query.filter as string);

        const db :Database = await database;

        let requestedPage = parseInt(req.params.page, 10);
        requestedPage = isNaN(requestedPage) ? 1 : requestedPage;
        if (requestedPage < 1) 
            throw("Incorrect number of page");

        // in case productsCount is 10 then it should return 1 page, so we need to divide by 9 instead of 10
        // and if productsCount is less than 10, we should return 1 page too
        const productsCount :number = await Products.getProductsCount(db, searchName, filter);
        const productsPageCount :number = Math.floor(productsCount / (ADMIN_PRODUCTS_PER_PAGE -1)) + 1;
        const products :Products.TProduct[] = await Products.getProducts(db, searchName, filter, ADMIN_PRODUCTS_PER_PAGE, (requestedPage - 1) * ADMIN_PRODUCTS_PER_PAGE);
        const featuredProducts :Products.TProduct[] = await Products.getFeaturedProducts(db);
        const props = {
            section: "productos",
            products: products,
            featuredProducts: featuredProducts,
            productsPageCount: productsPageCount,
            currentPage: requestedPage,
            searchName: searchName,
            filter: filter
        };
        renderAdminTemplate(props, res);
    } catch (err) { console.log(err); res.status(500).send(err); }
});

app.get("/admin/carousel", adminOnly, async (req :Request, res :Response) => {
    try {
        const db :Database = await database;
        Carousel.getCarouselItems(db)
        .then(carouselItems => {
            const props = {
                section: "carousel",
                sourceCarouselItems: carouselItems,
            };
            renderAdminTemplate(props, res);
        })
        .catch(err => res.send(err));
    } catch(err) {res.send(err);}
});


if (!fs.existsSync(carouselImagesTmpPath)) {
    console.log("creating carousel images temporal folder...");
    fs.mkdirSync(carouselImagesTmpPath, 0o744);
}
app.post("/admin/carousel/upload", adminOnly, async (req :Request, res :Response) => {
    const form = new multyparty.Form();
    form.parse(req, (err, fields, files) => {
        if (err)
            res.status(400).send(err);
        const carouselImage :multyparty.File = files["carouselImage"][0];
        const tmpPath :string = "public/upload/carousel" + carouselImage.path;
        fs.rename(carouselImage.path, tmpPath, err => {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.status(200).send({tmpImagePath: carouselImage.path.replace(/^\/tmp\//, "")}); // strip /tmp/ before send the name
        })
    });
    return;
});

app.post("/admin/carousel", express.json(), adminOnly, async (req :Request, res :Response) => {
    try {
        const db :Database = await database;
        const updatedCarousel = await Carousel.updateCarouselItems(db, req.body.source, req.body.destination);
        res.status(200).send(updatedCarousel);
    } catch(err) {
        res.status(500).send(err);
    }
});

app.get("/404", (req :Request, res :Response) => {
    res.send("Not found lol");
});

app.get("*", (req :Request, res :Response) => res.redirect("/404"));

server.listen( process.env.PORT || 5000, () => console.log("Running..."))