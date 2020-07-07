import React, { useState, useEffect } from "react";
import { TCarouselItem } from "../../../components/carousel";

import ArrowBackIcon from "../../../assets/icons/arrow_left-24px.svg";
import BgWithPlaceholder from "../../home/components/bgWithPlaceholder";

interface CarouselProps {
    carouselItems :TCarouselItem[]
}

export default ({carouselItems} : CarouselProps) => {

    const [index, setIndex] = useState<number>(0);

    const moveImage = (back :boolean) => () => {
        if (back) {
            if (index-1 >= 0) {
                setIndex(index-1);
            } else {
                setIndex(carouselItems.length-1);
            }
        } else {
            if (index+1 < carouselItems.length) {
                setIndex(index+1);
            } else {
                setIndex(0)
            }
        }
    }

    useEffect( () => {
        let timer = setInterval(() => moveImage(false)(),10000);  
        return () => clearInterval(timer);      
    });
    
    return (
        <div className="carousel-container">
            <BgWithPlaceholder className="carousel-content"
                style={{
                    backgroundImage: `url("/upload/carousel/${carouselItems[index].image_url}")`
                }}>
                <div className="carousel-nav">
                    <div className="carousel-arrow" onClick={moveImage(true)}><ArrowBackIcon className="svg-24" /></div>
                    <div className="carousel-arrow-separator"></div>
                    <div className="carousel-arrow" onClick={moveImage(false)}><ArrowBackIcon className="rotate-180 svg-24" /></div>
                </div>
                <div className="carousel-label no-select">{carouselItems[index].label}</div>
            </BgWithPlaceholder>
        </div>
    );
}