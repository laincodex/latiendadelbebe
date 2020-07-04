import React from "react";
import Paginator from "../../home/components/paginator";
import { TProduct } from "../../../components/products";
import SectionTitle from "../../home/components/sectiontitle";
import { parseDate } from "../../Utils";
import Tooltip from "../../home/components/Tooltip";

import StarIcon from "../../../assets/icons/star-24px.svg";
import RemoveIcon from "../../../assets/icons/remove_circle-24px.svg";
import AddIcon from "../../../assets/icons/baseline-add.svg";
import SearchIcon from "../../../assets/icons/search-24px.svg";
import ArrowIcon from "../../../assets/icons/arrow_back-24px.svg";

export interface ProductsProps {
    products :TProduct[],
    featuredProducts :TProduct[],
    productsPageCount : number,
    currentPage :number,
    searchName :string,
    filter :string
}
export default ({products, featuredProducts, productsPageCount, currentPage, searchName, filter} : ProductsProps)  => {
    const renderFeaturedProducts = () :JSX.Element[] => {
        const renderedProducts :JSX.Element[] = [];
        if (featuredProducts.length > 0) {
            featuredProducts.forEach( (product, index) => {
                renderedProducts.push(renderProductItem(product, index));
            });
        } else {
            renderedProducts.push(<li key={0} className="admin-product-empty">No hay ning&uacute;n producto destacado.</li>)
        }
        return renderedProducts;
    };
    
    const renderProducts = () :JSX.Element[] => {
        const renderedProducts :JSX.Element[] = [];
        if(products.length > 0) {
            products.forEach((product, index) => {
                renderedProducts.push(renderProductItem(product, index));
            });
        } else {
            renderedProducts.push(<li key={0} className="admin-product-empty">No hay ning&uacute;n producto, a&ntilde;ade uno.</li>)
        }
        return renderedProducts;
    }
    
    const renderProductItem = (product :TProduct, index :number) :JSX.Element => {
        return (
            <li key={index} className="admin-product-item">
                <ul className="admin-product-data" onClick={openProduct(product.id)}>
                    {!product.available && <div className="admin-product-nostock">SIN STOCK</div>}
                    <div className="admin-product-title">{product.title}</div>
                    <div className="admin-product-description">{product.description}</div>
                    <div className="admin-product-date">{parseDate(new Date(product.date*1000))}</div>
                </ul>
                <ul className="admin-product-item-actions">
                    <li onClick={featureProduct(product.id, !product.is_featured)} className={"admin-product-star" + ((product.is_featured) ? "-active" : "")}><Tooltip style={{marginTop: 40, width: 250}} title={"Haga click para " + (product.is_featured ? "dejar de " : "")  + "destacar"}><StarIcon /></Tooltip></li>
                    <li onClick={deleteProduct(product.id)} className="admin-product-remove-icon"><Tooltip style={{marginTop:35}} title="Eliminar"><RemoveIcon /></Tooltip></li>
                </ul>
            </li>);
    };

    const openProduct = (productId :number) => () => {
        document.location.href = "/admin/productos/" + productId + "?ref=" + escape(document.location.pathname + document.location.search);
    };

    const goToPage = (page :number) => () => {
        document.location.href = "/admin/productos/page/" + page + document.location.search;
    };

    const addProduct = () => {
        document.location.href = "/admin/productos/nuevo";
    };
    
    const featureProduct = (id :number, feature :boolean = true) => () => {
        const consent = confirm(feature ? "Destacar product?" : "Dejar de destacar el producto?");
        const product = {
            is_featured: feature
        };
        if (consent) {
            fetch("/admin/productos/" + id, {
                method: "PUT", 
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(product)
            }).then(res => {
                if (res.ok) {
                    location.reload();
                } else {
                    console.log("hubo un error");
                }
            });
        }
    };

    const deleteProduct = (id :number) => () => {
        const consent = confirm("Borrar el producto?");
        if (consent) {
            fetch("/admin/productos/" + id, {
                method: "DELETE",
            }).then(res => {
                if (res.ok) {
                    location.reload();
                } else {
                    console.log("hubo un error");
                }
            });
        }
    };

    const submitSearchForm = (ev :any) => {
        (document.getElementById("admin-products-search") as HTMLFormElement).submit();
    }

    return (
        <div className="admin-products-container">
            <div className="admin-nav-add">
                <Tooltip title="Agregar un nuevo producto" style={{marginTop: 35}} onClick={addProduct}><AddIcon /></Tooltip>
            </div>
            <SectionTitle title="DESTACADOS" />
            <ul>{renderFeaturedProducts()}</ul>
            <SectionTitle title="TODOS" />
            <div className="admin-products-search-nav">
                <form className="admin-products-search-form" id="admin-products-search">
                    <div className="admin-products-search-input">
                        <div className="admin-products-search-input-bar">
                            <SearchIcon />
                            <input type="text" name="title" id="admin-products-search" defaultValue={searchName} placeholder="Ingrese nombre a buscar"/>
                        </div>
                        <button type="submit"><ArrowIcon className="rotate-180" /></button>
                    </div>
                    <select name="filter" className="main-select admin-products-date-filter" defaultValue={filter} onChange={submitSearchForm}>
                        <option value="titleasc">Titulo (A-Z)</option>
                        <option value="titledesc">Titulo (Z-A)</option>
                        <option value="recent">Fecha de ingreso (m&aacute;s reciente)</option>
                        <option value="older">Fecha de ingreso (m&aacute;s antiguo)</option>
                        <option value="nostock">Sin stock</option>
                    </select>
                </form>
            </div>
            <ul>{renderProducts()}</ul>
            {productsPageCount > 1 && <Paginator pages={productsPageCount} currentPage={currentPage} MAX_BUTTONS={5} MAX_SIDE_BUTTONS={2} callback={goToPage} />}
        </div>
    );
}