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
import sharp from "sharp";

const app :Application = express();
const server : http.Server = http.createServer(app);
import HtmlTemplate from "./components/HtmlTemplate";

import HomePage, {HomePageProps} from "./pages/home";
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
const HOME_PRODUCTS_PER_PAGE = 8;

app.get("(/|/page/:page?)" || "/", async (req, res) => {
    try {
        const db :Database = await database;

        const carouselItems :Carousel.TCarouselItem[] = await Carousel.getCarouselItems(db);
        const featuredProducts :Products.TProduct[] = await Products.getFeaturedProducts(db, true);
        
        // getting products
        const requestedTitle = StringUtils.sanitizeString(req.query.title as string);
        const filter = StringUtils.sanitizeString(req.query.filter as string);
        let requestedPage = parseInt(req.params.page, 10);
        requestedPage = isNaN(requestedPage) ? 1 : requestedPage;
        if (requestedPage < 1) 
            throw("Page number should be higher than 0");

        let requestedCategory = parseInt(req.query.category as string, 10);
        requestedCategory = isNaN(requestedCategory) ? 0 : requestedCategory;

        const productsCount :number = await Products.getProductsCount(db, requestedTitle, filter);
        const productsPageCount :number = Math.ceil(productsCount / HOME_PRODUCTS_PER_PAGE);
        requestedPage = (requestedPage > productsPageCount) ? productsPageCount : requestedPage; // cap requested page to max page
        const products :Products.TProduct[] = await Products.getProducts(db, requestedTitle, requestedCategory, filter, HOME_PRODUCTS_PER_PAGE, (requestedPage - 1) * HOME_PRODUCTS_PER_PAGE, true);
        
        // getting categories
        const categories :Products.TCategory[] = await Products.getCategories(db);

        const props = {
            carouselItems :carouselItems,
            products: products,
            featuredProducts: featuredProducts,
            categories :categories,
            productsPageCount: productsPageCount,
            currentPage: requestedPage,
            requestedTitle: requestedTitle,
            requestedCategory :requestedCategory,
            filter: filter

        };
        res.send(HtmlTemplate({
            content: renderToString(React.createElement(HomePage, props)),
            props: JSON.stringify(props),
            head: "<title>La Tienda del BEBE</title>"
        }));

    } catch (err) { console.log(err); res.status(500).send(err); }
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

app.get("/admin/productos/nuevo", adminOnly, async (req :Request, res :Response) => {
    try {
        const db :Database = await database;
        const product :Products.TProduct = {
            id: 0,
            title: "",
            description: "",
            date: Date.now()/1000,
            categories: "[]",
            available: true,
            is_featured: false,
            primary_image_id: 0
        };
        const categories : Products.TCategory[] = await Products.getCategories(db);
        const props = {
            section: "productDetail",
            product: product,
            productImages: [],
            categories: categories,
            refUrl: getRefUrl(req, "/admin/productos"),
            isNewProduct: true
        };
        renderAdminTemplate(props, res);
    } catch (err) { console.log(err); res.status(500).send(err); }
});

app.get("/admin/productos/:productId", adminOnly, async (req :Request, res :Response) => {
    try {
        const db :Database = await database;
        const id = parseInt(req.params.productId, 10);
        if (!isNaN(id)) {
            const product :Products.TProduct | undefined = await Products.getProductDetail(db, id);
            const productImages : Products.TProductImage[] = await Products.getProductImages(db, id);
            const categories : Products.TCategory[] = await Products.getCategories(db);
            if (typeof product === 'undefined')
                throw("Product not found");
            const props = {
                section: "productDetail",
                product: product,
                productImages: productImages,
                categories: categories,
                refUrl: getRefUrl(req, "/admin/productos")
            };
            renderAdminTemplate(props, res);
        } else res.sendStatus(400);
    } catch (err) { console.log(err); res.status(500).send(err); }
});

app.get("/admin/productos(/page?/:page?)?", adminOnly, async (req :Request, res :Response) => {
    try {
        const requestedTitle = StringUtils.sanitizeString(req.query.title as string);
        const filter = StringUtils.sanitizeString(req.query.filter as string);

        const db :Database = await database;

        let requestedPage = parseInt(req.params.page, 10);
        requestedPage = isNaN(requestedPage) ? 1 : requestedPage;
        if (requestedPage < 1) 
            throw("Page number should be higher than 0");

        let requestedCategory = parseInt(req.query.category as string, 10);
        requestedCategory = isNaN(requestedCategory) ? 0 : requestedCategory;

        const productsCount :number = await Products.getProductsCount(db, requestedTitle, filter);
        const productsPageCount :number = Math.ceil(productsCount / ADMIN_PRODUCTS_PER_PAGE);
        requestedPage = (requestedPage > productsPageCount) ? productsPageCount : requestedPage; // cap requested page to max page
        const products :Products.TProduct[] = await Products.getProducts(db, requestedTitle, requestedCategory, filter, ADMIN_PRODUCTS_PER_PAGE, (requestedPage - 1) * ADMIN_PRODUCTS_PER_PAGE);
        const featuredProducts :Products.TProduct[] = await Products.getFeaturedProducts(db);
        const props = {
            section: "products",
            products: products,
            featuredProducts: featuredProducts,
            productsPageCount: productsPageCount,
            currentPage: requestedPage,
            requestedTitle: requestedTitle,
            filter: filter
        };
        renderAdminTemplate(props, res);
    } catch (err) { console.log(err); res.status(500).send(err); }
});

app.put("/admin/productos/:productId", adminOnly, express.json(), async (req :Request, res :Response) => {
    try {
        const db :Database = await database;
        const id = parseInt(req.params.productId, 10);
        const product :Products.TProduct = req.body;
        if (!isNaN(id) && (typeof product !== 'undefined')) {
            if(product.id === 0) {
                const newProductId = await Products.newProduct(db, product);
                res.status(200).send({id: newProductId});
                return;
            } else {
                await Products.updateProduct(db, id, product);
            }
            res.status(200).send({ok: true});
        } else {
            res.sendStatus(400);
        }
    } catch (err) { console.log(err); res.status(500).send(err); }
});

app.delete("/admin/productos/:productId", adminOnly, async (req :Request, res :Response) => {
    try {
        const db :Database = await database;
        const id = parseInt(req.params.productId, 10);
        if (!isNaN(id)) {
            await Products.deleteProduct(db, id);
            fs.rmdirSync("public/upload/products/" + id, {recursive: true});
            res.sendStatus(200);
        } else {
            res.sendStatus(400);
        }
    } catch (err) { console.log(err); res.status(500).send(err); }
});

app.post("/admin/productos/uploadImages", adminOnly, async (req :Request, res :Response) => {
    const form = new multyparty.Form();
    try {
        const db :Database = await database;
        form.parse(req, async (err, fields, files) => {
            if (err) {
                res.status(400).send(err);
                return;
            }
            const productId = parseInt(fields.productId[0],10);
            if (isNaN(productId))
                throw("Bad product id");
            const productTempImages :multyparty.File[] = files["productImages"];
            const productImagesPath :string = `public/upload/products/${productId}/`;
            const productImagesResolved :Products.TProductImage[] = [];
            if (!fs.existsSync(productImagesPath)) 
                fs.mkdirSync(productImagesPath);
            
            // verify if product hasn't any image in order to set new primary image
            const productImagesCount = await Products.getProductImagesCount(db, productId);

            for (let tempImageIndex = 0; tempImageIndex < productTempImages.length; tempImageIndex++) {
                const newImageFilename :string = productTempImages[tempImageIndex].path.replace(/^\/tmp\//, "");
                fs.renameSync(productTempImages[tempImageIndex].path, productImagesPath + newImageFilename);
                const newProductImage :Products.TProductImage = await Products.newProductImage(db, productId, newImageFilename);
                // create a thumbnail
                const thumbnailFilename :string = "thumb_" + newImageFilename;
                await sharp(productImagesPath + newImageFilename).resize({width: 500}).toFile(productImagesPath + thumbnailFilename);
                productImagesResolved.push(newProductImage);
            }

            if(productImagesCount == 0 && productImagesResolved.length > 0) {
                await Products.setProductPrimaryImage(db, productId, productImagesResolved[0].id);
            }
            res.status(200).send({images: productImagesResolved, previousProductImagesCount: productImagesCount});
        });
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
});

app.delete("/admin/productos/images/:imageId/:primary_image_id", adminOnly, async (req :Request, res :Response) => {
    try {
        const db :Database = await database;
        const imageId = parseInt(req.params.imageId, 10);
        const primaryImageId = parseInt(req.params.primary_image_id, 10);
        if (isNaN(imageId) || isNaN(primaryImageId))
            throw("Wrong image id");
        const image :Products.TProductImage | undefined = await Products.getProductImage(db, imageId);
        if (typeof image === 'undefined')
            throw("Image not found");
        await Products.setProductPrimaryImage(db, image.product_id, primaryImageId);
        await Products.deleteProductImage(db, imageId);
        const productImagesPath :string = `public/upload/products/${image.product_id}/`;
        if (fs.existsSync(productImagesPath + image.image_url)) {
            fs.unlinkSync(productImagesPath + image.image_url);
        }
        if (fs.existsSync(productImagesPath + "thumb_" + image.image_url)) {
            fs.unlinkSync(productImagesPath + "thumb_" + image.image_url);
        }
        res.status(200).send({ok: true});
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
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

app.get("/admin/categorias", adminOnly, async (req :Request, res :Response) => {
    try {
        const db :Database = await database;
        const categories :Products.TCategory[] = await Products.getCategories(db);
        const props = {
            section: "categorias",
            categories: categories,
        };
        renderAdminTemplate(props, res);
    } catch(err) {
        res.status(500).send(err);
    }
});

app.put("/admin/categorias", express.json(), adminOnly, async (req :Request, res :Response) => {
    try {
        const db :Database = await database;
        const categories :Products.TCategory[] = req.body;
        const categoriesToAdd :Products.TCategory[] = [];
        for (let catIndex = 0; catIndex < categories.length; catIndex++) {
            if (categories[catIndex].id === 0){
                categoriesToAdd.push(categories[catIndex]);
            } else {
                await Products.updateCategory(db, categories[catIndex]);
            }
        }
        await Products.newCategories(db, categoriesToAdd);
        res.sendStatus(200);
    } catch(err) {
        console.log(err);
        res.status(500).send(err);
    }
});

app.delete("/admin/categorias/:categoryId", adminOnly, async (req :Request, res :Response) => {
    try {
        const db :Database = await database;
        const categoryId = parseInt(req.params.categoryId, 10);
        if (isNaN(categoryId))
            throw("Wrong category id");
        await Products.deleteCategory(db, categoryId);
        res.sendStatus(200);
    } catch(err) {
        res.status(500).send(err);
    }
});

app.get("/404", (req :Request, res :Response) => {
    res.send("Not found lol");
});

app.get("*", (req :Request, res :Response) => res.redirect("/404"));

server.listen( process.env.PORT || 5000, () => console.log("Running..."))