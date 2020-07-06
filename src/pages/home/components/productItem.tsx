import React from "react";

import { TProduct } from "../../../components/products";

import StarIcon from "../../../assets/icons/star-24px.svg";
import { StringUtils } from "../../Utils";

interface Props extends React.DOMAttributes<HTMLElement> {
    product :TProduct
}

export default ({product, ...rest} : Props) => {

    const trimTitle = (title :string) => title.length > 25 ? title.substring(0, 25) + "..." : title;

    return (
        <article>
            <a href={`/productos/${product.id}/${StringUtils.slugify(product.title)}`} rel="bookmark" className="product-link" {...rest}>
                <div className="product-container">
                    <div className="product-photo" style={{
                        backgroundImage: `url("/upload/products/${product.id}/thumb_${product.primary_image_url}")`
                    }}></div>
                    {!product.available && <div className="product-item-nostock">SIN STOCK</div>}
                    {product.is_featured ? <div className="product-item-featured"><StarIcon />DESTACADO</div> : ""}
                    <div className="product-title no-select">{trimTitle(product.title)}</div>
                </div>
            </a>
        </article>
    );
}