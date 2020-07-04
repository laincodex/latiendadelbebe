import React, { useState, useEffect, useRef } from "react";
import SectionTitle from "./sectiontitle";
import Product from "./product";
import { TProduct, TCategory } from "../../../components/products";
import FeaturedProducts from "./featuredProducts";
import Paginator from "./paginator";


import SearchIcon from "../../../assets/icons/search-24px.svg";
import BreadcrumbsIcon from "../../../assets/icons/breadcrumbs.svg";

interface Props {
    featuredProducts :TProduct[],
    showSectionTitle? :boolean,
    products :TProduct[],
    categories :TCategory[]
}

export default ({
    featuredProducts,
    showSectionTitle = true,
    products,
    categories
} : Props) => {

    const renderCategories = () :Array<JSX.Element> => {
        let list :Array<JSX.Element> = [];
        categories.map( (c, key) => {
            list.push(<li className="product-list-nav-item" key={key}>{c.name}</li>);
        });
        return list;
    }

    const [currentPage, setCurrentPage] = useState<number>(1);

    const goToPage = (page :number) => () => {
        if (page != currentPage) {
            setCurrentPage(page);
        }
    }

    const renderProductList = () :Array<JSX.Element> => {
        let rendered :Array<JSX.Element> = [];
        products.forEach((product, index) => {
            rendered.push(<li key={index}><Product product={product} onClick={openProduct(product.id)} /></li>);
        });
        return rendered;
    };

    const openProduct = (id :number) => () => {
        document.location.href = "/productos/" + id + "?ref=" + escape(document.location.pathname + document.location.search);
    };

    return (
        <div className="product-list-container">
            {(featuredProducts) && <FeaturedProducts featuredProducts={featuredProducts} />}
            <div className="product-list-content">
                {(showSectionTitle) ? <SectionTitle title="PRODUCTOS" /> : <></>}
                <section className="product-list-section">
                    <div className="product-list">
                        <div className="product-list-nav-container no-select">
                            <ul className="product-list-nav">
                                <li className="product-list-nav-header">CATEGORIAS</li>
                                {renderCategories()}
                            </ul>
                        </div>
                        <div className="product-list-items-container">
                            <div className="product-list-header">
                                <div className="product-list-breadcrumbs no-select">
                                    <div>Productos</div>
                                    <BreadcrumbsIcon />
                                    <div>Conjuntos</div>
                                </div>
                                <div className="products-search-bar">
                                    <SearchIcon />
                                    <input type="text" placeholder="Ingresa para buscar" name="Search" id="product-search-text"/>
                                </div>
                            </div>
                            <ul className="product-list-items">
                                {renderProductList()}
                            </ul>
                        </div>
                    </div>
                    <div className="product-list-paginator-container">
                        <Paginator pages={17} currentPage={currentPage} callback={goToPage} />
                    </div>
                </section>
                </div>
        </div>
    );
}