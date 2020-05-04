import React from "react";
import ReactDOM from "react-dom";
import Home from "./pages/home";

const initialState = (window as any)._initialstate || {};

ReactDOM.hydrate(React.createElement(Home, initialState), document.getElementById("app"));