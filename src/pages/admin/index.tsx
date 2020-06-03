import React from "react";

import BannersPage from "./components/banners";

import ExitIcon from "../../assets/icons/baseline-exit_to_app.svg";
import BannerIcon from "../../assets/icons/collections-24px.svg";
import ProductsIcon from "../../assets/icons/local_mall-24px.svg";
import CategoriesIcon from "../../assets/icons/local_offer-24px.svg";
import ContactIcon from "../../assets/icons/contact_mail-24px.svg";

export default ( { section } : { section? :string }) => {
    return (
        <div className="admin-panel-container">
            <div className="admin-panel-topnav">LA TIENDA DEL BEBE</div>
            <div className="admin-panel-content">
                <nav className="admin-panel-nav">
                    <ul className="admin-panel-menu">
                        <h3>ADMIN MENU</h3>
                        <li><a href="/admin/productos"><ProductsIcon />Productos</a></li>
                        <li><a href="/admin/banners"><BannerIcon />Banners</a></li>
                        <li><a href="/admin/categorias"><CategoriesIcon />Categorias</a></li>
                        <li><a href="/admin/contacto"><ContactIcon />Datos de contacto</a></li>
                    </ul>
                    <a href="/admin/logout" className="admin-panel-exit"><ExitIcon /> Salir</a>
                </nav>
                <div className="admin-panel-body">
                    {(()=>{
                        switch (section) {
                            case "productos":
                            case undefined:
                                return <div>Products</div>;
                            case "banners":
                                return <BannersPage />;
                            case "categorias":
                                return <div>Categorias</div>;
                            case "contacto":
                                return <div>Contacto</div>;
                        }
                    })()}
                </div>
            </div>
        </div>
    );
}