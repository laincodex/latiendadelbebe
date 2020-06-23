import React from "react";
import { render } from "react-dom";
import { TProduct, TProductImages } from "../../../components/products";
import { parseDate } from "../../Utils";
import Tooltip from "../../home/components/Tooltip";

import ArrowBackIcon from "../../../assets/icons/arrow_back-24px.svg";
import StarIcon from "../../../assets/icons/star-24px.svg";
import RemoveIcon from "../../../assets/icons/remove_circle-24px.svg";
import AddIcon from "../../../assets/icons/baseline-add.svg";

export interface ProductDetailProps {
    product: TProduct,
    product_images :TProductImages[],
    refUrl :string
}

export default ({ product, product_images, refUrl } :ProductDetailProps) => {
    const goBack = () => {
        document.location.href = refUrl;
    };
    const handleDescriptionChange = (ev :any) => {
        console.log(ev.target.value);
    };
    return (
        <div className="admin-product-detail-container">
            <div className="admin-product-detail-goback" onClick={goBack}><ArrowBackIcon /> Volver</div>
            <div className="admin-product-detail-header">
                <input className="admin-product-detail-title" defaultValue={product.title} name="title" placeholder="Ingrese el titulo del producto." />
                <div className="admin-product-detail-data">
                    <div className={"admin-product-star" + (product.is_featured ? "-active" : "")}><Tooltip style={{marginTop: 50, width: 250}} title={"Haga click para " + (product.is_featured ? "dejar de " : "")  + "destacar"}><StarIcon /></Tooltip></div>
                    <div className="admin-product-detail-date">{parseDate(new Date(product.date*1000))}</div>
                    <div className={"admin-product-detail" + (product.available ? "-stock" : "-nostock")}><Tooltip style={{marginTop: 38}} title={(product.available ? "Deshabilitar el stock" : "Habilitar el stock")}>{product.available ? "EN STOCK" : "SIN STOCK"}</Tooltip></div>
                </div>
            </div>
            <textarea className="admin-product-detail-description" value={product.description} onChange={handleDescriptionChange}></textarea>
            <div className="admin-product-detail-categories"></div>
            <div className="admin-product-detail-photos"></div>
            <div className="admin-product-detail-remove"><RemoveIcon /> ELIMINAR</div>
            <button>GUARDAR CAMBIOS</button>
        </div>
    );
};