import React from "react";
import Paginator from "../../home/components/paginator";
import { TProduct } from "../../../components/products";
import SectionTitle from "../../home/components/sectiontitle";
import { parseDate } from "../../Utils";
import Tooltip from "../../home/components/Tooltip";

import StarIcon from "../../../assets/icons/star-24px.svg";
import RemoveIcon from "../../../assets/icons/remove_circle-24px.svg";
import AddIcon from "../../../assets/icons/baseline-add.svg";

export interface ProductsProps {
    products :TProduct[],
    featuredProducts :TProduct[],
    productsPageCount : number,
    currentPage :number
}
export default ({products, featuredProducts, productsPageCount, currentPage} : ProductsProps)  => {
    const renderFeaturedProducts = () :JSX.Element[] => {
        const renderedProducts :JSX.Element[] = [];
        featuredProducts.forEach( (product, index) => {
            renderedProducts.push(renderProductItem(product, index));
        });
        return renderedProducts;
    };
    
    const renderProducts = () :JSX.Element[] => {
        const renderedProducts :JSX.Element[] = [];
        products.forEach((product, index) => {
            renderedProducts.push(renderProductItem(product, index));
        });
        return renderedProducts;
    }
    
    const renderProductItem = (product :TProduct, index :number) :JSX.Element => {
        return (
            <li key={index} className="admin-product-item">
                <ul className="admin-product-data" onClick={openProduct(product.id)}>
                    <div className="admin-product-title">{product.title}</div>
                    <div className="admin-product-description">{product.description}</div>
                    <div className="admin-product-date">{parseDate(new Date(product.date*1000))}</div>
                </ul>
                <ul className="admin-product-item-actions">
                    <li className={"admin-product-star" + ((product.is_featured) ? "-active" : "")}><Tooltip style={{marginTop: 40, width: 250}} title={"Haga click para " + (product.is_featured ? "dejar de " : "")  + "destacar"}><StarIcon /></Tooltip></li>
                    <li className="admin-product-remove-icon"><Tooltip style={{marginTop:35}} title="Eliminar"><RemoveIcon /></Tooltip></li>
                </ul>
            </li>);
    };

    const openProduct = (productId :number) => () => {
        console.log("opening product", productId);
        console.log("asd: ", productsPageCount)
    };

    const goToPage = (page :number) => () => {
        document.location.href = "/admin/productos/page/" + page;
    }

    const addProduct = () => {

    }

    const submitSearchForm = (ev :any) => {
        (document.getElementById("admin-products-search") as HTMLFormElement).submit();
    }

    if (products.length <= 0)
        return (
            <div className="admin-products-empty">
                <span>No hay ningun producto, añade uno.</span>
                <button className="admin-circle-add-btn" />
            </div>
        );

    return (
        <div className="admin-products-container">
            <div className="admin-nav-add">
                <Tooltip title="Agregar un nuevo producto" style={{marginTop: 35}} onClick={addProduct}><AddIcon /></Tooltip>
            </div>
            <SectionTitle title="DESTACADOS" />
            <ul>{renderFeaturedProducts()}</ul>
            <SectionTitle title="TODOS" />
            <div className="admin-products-search-nav">
                <form className="admin-products-search" id="admin-products-search">
                    <input type="text" name="name" id="admin-products-search"/>
                    <button type="submit">S</button>
                    <select name="filter" id="admin-products-date-filter" onChange={submitSearchForm}>
                        <option value="recent">Fecha de ingreso (m&aacute;s reciente)</option>
                        <option value="older">Fecha de ingreso (m&aacute;s antiguo)</option>
                        <option value="nostock">Sin stock</option>
                    </select>
                </form>
            </div>
            <ul>{renderProducts()}</ul>
            <Paginator pages={productsPageCount} currentPage={currentPage} MAX_BUTTONS={5} MAX_SIDE_BUTTONS={2} callback={goToPage} />
        </div>
    );
}