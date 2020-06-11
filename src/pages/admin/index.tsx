import React from "react";

import BannersPage, { BannersProps } from "./components/banners";

import ExitIcon from "../../assets/icons/baseline-exit_to_app.svg";
import BannerIcon from "../../assets/icons/collections-24px.svg";
import ProductsIcon from "../../assets/icons/local_mall-24px.svg";
import CategoriesIcon from "../../assets/icons/local_offer-24px.svg";
import ContactIcon from "../../assets/icons/contact_mail-24px.svg";

export default ( { section, ...props } : { section? :string }) => {
    const isCurrentSection = (inputSection :string) => (section == inputSection) ? "admin-panel-sectionactive" : "";
    return (
        <div className="admin-panel-container">
            <div className="admin-panel-topnav">LA TIENDA DEL BEBE</div>
            <div className="admin-panel-content">
                <nav className="admin-panel-nav">
                    <ul className="admin-panel-menu">
                        <h3>ADMIN MENU</h3>
                        <li className={isCurrentSection("productos")}><a href="/admin/productos"><ProductsIcon />Productos</a></li>
                        <li className={isCurrentSection("banners")}><a href="/admin/banners"><BannerIcon />Banners</a></li>
                        <li className={isCurrentSection("categorias")}><a href="/admin/categorias"><CategoriesIcon />Categorias</a></li>
                        <li className={isCurrentSection("contacto")}><a href="/admin/contacto"><ContactIcon />Datos de contacto</a></li>
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
                                return <BannersPage {...props as BannersProps} />;
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