import React from "react";
import Paginator from "../../home/components/paginator";
import { TProduct } from "../../../components/products";
import SectionTitle from "../../home/components/sectiontitle";

export interface ProductsProps {
    products :TProduct[],
    featuredProducts :TProduct[]
}
export default ({products, featuredProducts} : ProductsProps)  => {
    return (
        <div className="admin-products-container">
            <SectionTitle title="DESTACADOS" />
            <div className="admin-products-featured-container"></div>
            <SectionTitle title="TODOS" />
            <Paginator pages={15} currentPage={1} MAX_BUTTONS={5} MAX_SIDE_BUTTONS={2} callback={()=>{}} />
        </div>
    );
}