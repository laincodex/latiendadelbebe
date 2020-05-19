import React, { useState } from "react";
import SectionTitle from "./sectiontitle";
import Product, {TProduct} from "./product";
import Paginator from "./paginator";
import Overlay from "./Overlay";

import SearchIcon from "../../../assets/icons/search-24px.svg";
import Breadcrumbs from "../../../assets/icons/breadcrumbs.svg";

interface Category {
    name :string,
    id :number
}

export default () => {

    const productExample :TProduct = {
        id: 1,
        name: "Product Test 1",
        image: "product-1.jpg",
        title: "Product test 1",
        description: "asddasd"
    };

    const categories :Array<Category> = [
        { 
            name: "Remeras",
            id: 1
        }, {
            name: "Conjuntos",
            id: 2
        }, {
            name: "Buzos",
            id: 3
        }
    ];

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
        let products :Array<JSX.Element> = [];
        for (let i =0; i<8;i++) {
            products.push(<li key={i}><Product product={productExample} onClick={openProductOverlay(productExample.id)} /></li>);
        }
        return products;
    }

    const [productOverlayOpen, setProductOverlayOpen] = useState<boolean>(false);
    
    const openProductOverlay = (productId :number) => (ev :any) => {
        ev.preventDefault();
        console.log("Opening product id: ", productId);
        setProductOverlayOpen(true);
    }
    
    const closeProductOverlay = () => {
        setProductOverlayOpen(false);
    }

    return (
        <div className="product-list-container">
            <div className="product-list-content">
                <SectionTitle title="PRODUCTOS" />
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
                                <div className="product-list-breadcrumbs">
                                    <div className="no-select">Productos</div>
                                    <Breadcrumbs />
                                    <div>Conjuntos</div>
                                </div>
                                <div className="flex-separator"></div>
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
                <Overlay openState={productOverlayOpen} closeCallback={closeProductOverlay}>
                    <div className="product-overlay">
                        asdasd
                    </div>
                </Overlay>
            </div>
        </div>
    );
}