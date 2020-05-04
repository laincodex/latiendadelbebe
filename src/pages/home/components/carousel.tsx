import React, { useState, useEffect } from "react";
import ArrowBackIcon from "../../../assets/icons/arrow_left-24px.svg";


const carousel_images = ["carousel_1.png", "carousel_2.png"];
const carousel_labels = ["Tenemos todo para ellos", "Y para ellas"];

export default (props :any) => {

    const [index, setIndex] = useState<number>(0);

    const moveImage = (back :boolean) => () => {
        if (back) {
            if (index-1 >= 0)
                setIndex(index-1);
        } else 
            if (index+1 < carousel_images.length)
                setIndex(index+1);
    }

    const isNavEnabled = (back :boolean) => {
        let enabled :boolean;
        if (back) {
            enabled = (index-1 >= 0);
        } else enabled = (index+1 < carousel_images.length);

        return (enabled) ? "carousel-nav-enable" : "";
    }
    
    let counter = 0;

    useEffect( () => {
        let timer = setInterval(() => {
            if (index+1 < carousel_images.length) {
                moveImage(false)();
            } else
                setIndex(0);
        },10000);  
        return () => clearInterval(timer);      
    });
    
    return (
        <div className="carousel-container">
            <div className="carousel-content"
                style={{
                    backgroundImage: 'url("upload/carousel/' + carousel_images[index] + '")'
                }}>
                <div className="carousel-nav">
                    <div className={isNavEnabled(true)} onClick={moveImage(true)}><ArrowBackIcon className="svg-24" /></div>
                    <div className="carousel-arrow-separator"></div>
                    <div className={isNavEnabled(false)} onClick={moveImage(false)}><ArrowBackIcon className="rotate-180 svg-24" /></div>
                </div>
                <div className="carousel-label">{carousel_labels[index]}</div>
            </div>
        </div>
    );
}