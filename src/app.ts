import React from "react";
import { renderToString } from "react-dom/server";
import express, { Application } from "express";
import http from "http";

const app :Application = express();
const server : http.Server = http.createServer(app);
import HtmlTemplate from "./components/HtmlTemplate";

import Home from "./pages/home";

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
        content: renderToString(React.createElement(Home)),
        state: '""',
        head: "<title>hola</title>"
    }));
});

server.listen( process.env.PORT || 5000, () => console.log("Running..."))