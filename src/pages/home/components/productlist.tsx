import React, { useState, useEffect, useRef } from "react";
import SectionTitle from "./sectiontitle";
import ProductItem from "./productItem";
import { TProduct, TCategory } from "../../../components/products";
import FeaturedProducts from "./featuredProducts";
import Paginator from "./paginator";
import { useIsFirstRender } from "../../Utils";

import SearchIcon from "../../../assets/icons/search-24px.svg";
import BreadcrumbsIcon from "../../../assets/icons/breadcrumbs.svg";

export interface ProductListProps {
    featuredProducts :TProduct[],
    showSectionTitle? :boolean,
    products :TProduct[],
    categories :TCategory[],
    productsPageCount :number,
    currentPage :number,
    requestedTitle :string,
    requestedCategory :number,
    filter :string
}

export default ({
    featuredProducts,
    showSectionTitle = true,
    products,
    categories,
    productsPageCount,
    currentPage,
    requestedTitle,
    requestedCategory,
    filter
} : ProductListProps) => {

    const isFirstRender = useIsFirstRender();
    useEffect(() => {
        if (isFirstRender) {
            document.body.scrollTop = parseInt(localStorage.getItem("scrollPosition") || "0", 10);
            localStorage.setItem("scrollPosition", "0");
        }
    },[]);

    const renderCategories = () :Array<JSX.Element> => {
        let rendered :Array<JSX.Element> = [];
        categories.forEach( (cat, index) => {
            rendered.push(<li className={`product-list-categories-item ${cat.id === requestedCategory ? "product-list-categories-item-active": ""}`} key={index} onClick={goToCategory(cat.id.toString())}>{cat.id === 0 ? "Todas" : cat.name}</li>);
        });
        return rendered;
    };

    const goToPage = (page :number) => () => {
        if (page != currentPage) {
            document.location.href = "/page/" + page + document.location.search;
        }
    };

    const goToCategory = (id :string) => () => {
       (document.getElementById("product-list-category-input") as HTMLInputElement).value = id;
       submitForm();
    };

    const getCategory = (id :number) => {
        const category = categories.find(c => c.id == id);
        if (!category)
            return {id: id, name: "Todos"};
        return category;
    };

    const renderProductList = () :Array<JSX.Element> => {
        let rendered :Array<JSX.Element> = [];
        products.forEach((product, index) => {
            rendered.push(<li key={index}><ProductItem product={product} onClick={openProduct(product.id)} /></li>);
        });
        return rendered;
    };

    const openProduct = (id :number) => (ev:any) => {
        ev?.preventDefault();
        document.location.href = "/productos/" + id + "?ref=" + escape(document.location.pathname + document.location.search);
    };

    const submitForm = (ev? :any) => {
        ev?.preventDefault();
        localStorage.setItem("scrollPosition", document.body.scrollTop.toString());
        (document.getElementById("product-list-form") as HTMLFormElement).submit();
        console.log("paso por aca xD");
    };

    return (
        <div className="product-list-container">
            {(featuredProducts) && <FeaturedProducts featuredProducts={featuredProducts} />}
            <div className="product-list-content">
                {(showSectionTitle) && <SectionTitle title="PRODUCTOS" />}
                <form className="product-list-section" id="product-list-form" onSubmit={submitForm}>
                    <div className="product-list">
                        <div className="product-list-categories-container no-select">
                            <ul className="product-list-categories">
                                <li className="product-list-categories-header">CATEGORIAS</li>
                                {renderCategories()}
                            </ul>
                        </div>
                        <input type="hidden" defaultValue={requestedCategory} name="category" id="product-list-category-input" />
                        <div className="product-list-items-container">
                            <div className="product-list-header">
                                <div className="product-list-breadcrumbs no-select">
                                    <div onClick={goToCategory("0")}>Productos</div>
                                    <BreadcrumbsIcon />
                                    <div>{getCategory(requestedCategory).name}</div>
                                </div>
                                <select name="filter" className="main-select" defaultValue={filter} onChange={submitForm}>
                                    <option value="titleasc">Titulo (A-Z)</option>
                                    <option value="titledesc">Titulo (Z-A)</option>
                                    <option value="recent">Fecha de ingreso (m&aacute;s reciente)</option>
                                    <option value="older">Fecha de ingreso (m&aacute;s antiguo)</option>
                                    <option value="nostock">Sin stock</option>
                                </select>
                                <div className="products-search-bar">
                                    <SearchIcon />
                                    <input type="text" defaultValue={requestedTitle} placeholder="Ingresa para buscar" name="title" id="product-search-text"/>
                                </div>
                            </div>
                            <ul className="product-list-items">
                                {renderProductList()}
                            </ul>
                        </div>
                    </div>
                    {productsPageCount > 1 && <div className="product-list-paginator-container">
                        <Paginator pages={productsPageCount} currentPage={currentPage} callback={goToPage} />
                    </div>}
                </form>
                </div>
        </div>
    );
}