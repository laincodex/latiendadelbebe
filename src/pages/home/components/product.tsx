import React from "react";

export interface TProduct {
    id :number,
    name :string,
    image :string,
    title :string,
    description :string
};

interface Props extends React.DOMAttributes<HTMLElement> {
    product :TProduct
}

export default ({product, ...rest} : Props) => {

    const trimTitle = (title :string) => title.length > 25 ? title.substring(0, 25) + "..." : title;

    return (
        <article>
            <a href="#" rel="bookmark" className="product-link" {...rest}>
                <div className="product-container">
                    <div className="product-photo" style={{
                        backgroundImage: `url("/upload/products/${product.image}")`
                    }}></div>
                    <div className="product-title no-select">{trimTitle(product.title)}</div>
                </div>
            </a>
        </article>
    );
}