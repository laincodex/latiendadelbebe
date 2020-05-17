import React, { useState } from "react";

export interface TProduct {
    name :string,
    image :string,
    title :string,
    description :string
};

export default ({product} : {product:TProduct}) => {
    const [isOverlayActive, setIsOverlayActive] = useState<boolean>(false);

    const renderOverlay = () => {
        if (isOverlayActive)
            return <div className="product-overlay">Loading...</div>;
    }

    const trimTitle = (title :string) => title.length > 25 ? title.substring(0, 25) + "..." : title;

    return (
        <article>
            <a href="#" rel="bookmark" className="product-link">
                <div className="product-container">
                    <div className="product-photo" style={{
                        backgroundImage: `url("upload/products/${product.image}")`
                    }}></div>
                    <div className="product-title no-select">{trimTitle(product.title)}</div>
                </div>
            </a>
            {renderOverlay()}
        </article>
    );
}