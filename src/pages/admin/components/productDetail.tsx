import React, { useState } from "react";
import { TProduct, TProductImage, TCategory } from "../../../components/products";
import { parseDate } from "../../Utils";
import Tooltip from "../../home/components/Tooltip";

import ArrowBackIcon from "../../../assets/icons/arrow_back-24px.svg";
import StarIcon from "../../../assets/icons/star-24px.svg";
import RemoveIcon from "../../../assets/icons/remove_circle-24px.svg";
import AddIcon from "../../../assets/icons/baseline-add.svg";
import CloseIcon from "../../../assets/icons/close.svg";

export interface ProductDetailProps {
    product: TProduct,
    productImages :TProductImage[],
    categories :TCategory[],
    refUrl :string
}

export default ({ product, productImages, categories, refUrl } :ProductDetailProps) => {
    const [productState, setProductState] = useState<TProduct>(product);

    const goBack = () => {
        document.location.href = refUrl;
    };

    const handleDescriptionChange = (ev :any) => {
        product.description = ev.target.innerText;
        setProductState({...product});
    };

    const renderCategories = () :JSX.Element[] => {
        const rendered :JSX.Element[] = [];
        const productCategories :number[] = JSON.parse(product.categories);
        productCategories.forEach((cat, index) => {
            const category = getCategory(cat);
            rendered.push(
                <li key={index} className="admin-product-category-item">
                    <span>{category.name.toUpperCase()}</span>
                    <div className="remove-badge" onClick={removeCategory(category.id)}><CloseIcon /></div>
                </li>
            );
        });
        if (productCategories.length != categories.length) {
            rendered.push(<div key={productCategories.length} className="admin-product-detail-category-add" onClick={addCategory}><AddIcon />Agregar categoria</div>);
        }
        return rendered;
    };

    const getCategory = (id :number) => {
        const category = categories.find(c => c.id == id);
        if (!category)
            return {id: 0, name: "error"};
        return category;
    }

    const addCategory = () => {

    };

    const removeCategory = (id :number) => () => {
        console.log("removing category: ", id);
    };

    const renderPhotos = () :JSX.Element[] => {
        const rendered :JSX.Element[] = [];
        productImages.forEach((image, index) => {
            rendered.push(
                <ul key={index}>
                    <li key={index} className="admin-product-detail-photos-item" style={{backgroundImage: `url("/upload/products/${product.id}/thumb_${image.image_url}")`}}>
                        <div className="remove-badge" onClick={removeImage(image.id)}><CloseIcon /></div>
                        {(product.primary_image_id !== image.id) && <div className="admin-product-detail-photos-setprimary" onClick={setPrimaryImage(image.id)}><StarIcon /></div>}
                    </li>
                    {(product.primary_image_id === image.id) && <div className="admin-product-detail-photos-item-primary"><div></div><span>Principal</span></div>}
                </ul>);
        });
        return rendered;
    }

    const removeImage = (id :number) => () => {
        console.log("removing image: ", id);
    };

    const setPrimaryImage = (id :number) => () => {
        console.log("set primary", id);
    };

    return (
        <div className="admin-product-detail-container">
            <div className="admin-product-detail-goback" onClick={goBack}><ArrowBackIcon /> Volver</div>
            <h3>Titulo</h3>
            <div className="admin-product-detail-header">
                <input className="admin-product-detail-title" defaultValue={product.title} name="title" placeholder="Ingrese el titulo del producto." />
                <div className="admin-product-detail-data">
                    <div className={"admin-product-star" + (product.is_featured ? "-active" : "")}><Tooltip style={{marginTop: 50, width: 250}} title={"Haga click para " + (product.is_featured ? "dejar de " : "")  + "destacar"}><StarIcon /></Tooltip></div>
                    <div className="admin-product-detail-date">{parseDate(new Date(product.date*1000))}</div>
                    <div className={"admin-product-detail" + (product.available ? "-stock" : "-nostock")}><Tooltip style={{marginTop: 38}} title={(product.available ? "Deshabilitar el stock" : "Habilitar el stock")}>{product.available ? "EN STOCK" : "SIN STOCK"}</Tooltip></div>
                </div>
            </div>
            <h3>Descripcion del producto</h3>
            <div contentEditable={true} className="admin-product-detail-description" onBlur={handleDescriptionChange} suppressContentEditableWarning={true}>{product.description}</div>
            <h3>Categorias</h3>
            <ul className="admin-product-detail-categories">
                {renderCategories()}
            </ul>
            <h3>Fotos</h3>
            <ul className="admin-product-detail-photos">
                {renderPhotos()}
                <div className="admin-product-detail-photos-add"><AddIcon /></div>
            </ul>
            <div className="admin-product-detail-remove"><RemoveIcon />ELIMINAR PRODUCTO</div>
            <button className="admin-product-details-save">GUARDAR CAMBIOS</button>
        </div>
    );
};