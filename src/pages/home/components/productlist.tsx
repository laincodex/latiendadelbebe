import React from "react";
import SectionTitle from "./sectiontitle";
import Product, {TProduct} from "./product";

interface Category {
    name :string,
    id :number
}

export default () => {
    const productExample :TProduct = {
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

    return (
        <div className="product-list-container">
            <div className="product-list-content">
                <SectionTitle title="PRODUCTS" />
                <section className="product-list">
                    <div className="product-list-nav-container no-select">
                        <ul className="product-list-nav">
                            <li className="product-list-nav-header">CATEGORIAS</li>
                            {renderCategories()}
                        </ul>
                    </div>
                    <ul className="product-list-items">
                        <li><Product product={productExample} /></li>
                        <li><Product product={productExample} /></li>
                        <li><Product product={productExample} /></li>
                        <li><Product product={productExample} /></li>
                        <li><Product product={productExample} /></li>
                        <li><Product product={productExample} /></li>
                        <li><Product product={productExample} /></li>
                    </ul>
                </section>
            </div>
        </div>
    );
}