import React, { useState } from "react";
import { TProduct, TProductImage, TCategory } from "../../../components/products";
import { parseDate } from "../../Utils";
import Tooltip from "../../home/components/Tooltip";

import ArrowBackIcon from "../../../assets/icons/arrow_back-24px.svg";
import StarIcon from "../../../assets/icons/star-24px.svg";
import RemoveIcon from "../../../assets/icons/remove_circle-24px.svg";
import AddIcon from "../../../assets/icons/baseline-add.svg";
import CloseIcon from "../../../assets/icons/close.svg";
import { title } from "process";
import Overlay from "../../home/components/Overlay";

export interface ProductDetailProps {
    product: TProduct,
    productImages :TProductImage[],
    categories :TCategory[],
    refUrl :string
}

export default ({ product, productImages, categories, refUrl } :ProductDetailProps) => {
    const [productState, setProductState] = useState<TProduct>(product);
    const [productImagesState, setProductImagesState] = useState<TProductImage[]>(productImages);
    const [hasAnyChangesFlag, setHasAnyChangesFlag] = useState<boolean>(false);
    const [categoriesToAdd, setCategoriesToAdd] = useState<TCategory[]>([]);
    const [addCategoriesOverlay, setAddCategoriesOverlay] = useState<boolean>(false);

    const goBack = () => {
        document.location.href = refUrl;
    };

    const handleTitleChange = (ev :any) => {
        productState.title = ev.target.value;
        setHasAnyChangesFlag(true);
        setProductState({...productState});
    };

    const handleDescriptionChange = (ev :any) => {
        productState.description = ev.target.innerText;
        setHasAnyChangesFlag(true);
        setProductState({...productState});
    };

    const renderCategories = () :JSX.Element[] => {
        const rendered :JSX.Element[] = [];
        const productCategories :number[] = JSON.parse(productState.categories);
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
            rendered.push(<div key={productCategories.length} className="admin-product-detail-category-add" onClick={openAddCategories}><AddIcon />Agregar categoria</div>);
        }
        return rendered;
    };

    const getCategory = (id :number) => {
        const category = categories.find(c => c.id == id);
        if (!category)
            return {id: 0, name: "error"};
        return category;
    }

    const openAddCategories = () => {
        const productCategories :number[] = JSON.parse(productState.categories);
        setCategoriesToAdd(categories.filter(c => productCategories.indexOf(c.id) === -1));
        setAddCategoriesOverlay(true);
    };

    const addCategory = (id:number) => () => {
        const productCategories :number[] = JSON.parse(productState.categories);
        productCategories.push(id);
        productState.categories = JSON.stringify(productCategories);
        setProductState({...productState});
        setHasAnyChangesFlag(true);
        closeAddCategories();
    }

    const removeCategory = (id :number) => () => {
        const productCategories :number[] = JSON.parse(productState.categories);
        const index = productCategories.indexOf(id);
        if (index > -1) {
            productCategories.splice(index, 1);
            productState.categories = JSON.stringify(productCategories);
            setHasAnyChangesFlag(true);
            setProductState({...productState});
        }
    };

    const renderPhotos = () :JSX.Element[] => {
        const rendered :JSX.Element[] = [];
        productImagesState.forEach((image, index) => {
            rendered.push(
                <ul key={index}>
                    <li key={index} className="admin-product-detail-photos-item" style={{backgroundImage: `url("/upload/products/${productState.id}/thumb_${image.image_url}")`}}>
                        <div className="remove-badge" onClick={removeImage(image.id)}><CloseIcon /></div>
                        {(productState.primary_image_id !== image.id) && <div className="admin-product-detail-photos-setprimary" onClick={setPrimaryImage(image.id)}><StarIcon /></div>}
                    </li>
                    {(productState.primary_image_id === image.id) && <div className="admin-product-detail-photos-item-primary"><div></div><span>Principal</span></div>}
                </ul>);
        });
        return rendered;
    }

    const removeImage = (id :number) => () => {
        const newProductImagesState = productImagesState.filter(i => i.id !== id);
        productState.primary_image_id = newProductImagesState[0]?.id || 0;
        setHasAnyChangesFlag(true);
        setProductImagesState(newProductImagesState);
        setProductState({...productState});
    };

    const setPrimaryImage = (id :number) => () => {
        productState.primary_image_id = id;
        setHasAnyChangesFlag(true);
        setProductState({...productState});
    };

    const toggleFeatured = () => {
        productState.is_featured = !productState.is_featured;
        setHasAnyChangesFlag(true);
        setProductState({...productState});
    };

    const closeAddCategories = () => {
        setAddCategoriesOverlay(false);
    };

    const renderCategoriesToAdd = () :JSX.Element[] => {
        const rendered :JSX.Element[] = [];
        categoriesToAdd.forEach((cat, index) => {
            rendered.push(<div key={index} onClick={addCategory(cat.id)}><span>{cat.name}</span></div>)
        })
        return rendered;
    }

    const saveChanges = () => {

    };

    const cancelChanges = () => {
        location.reload();
    }

    return (
        <div className="admin-product-detail-container">
            <div className="admin-product-detail-goback" onClick={goBack}><ArrowBackIcon /> Volver</div>
            <h3>Titulo</h3>
            <div className="admin-product-detail-header">
                <input className="admin-product-detail-title" defaultValue={productState.title} onChange={handleTitleChange} placeholder="Ingrese el titulo del producto." />
                <div className="admin-product-detail-data">
                    <div className={"admin-product-star" + (productState.is_featured ? "-active" : "")} onClick={toggleFeatured}><Tooltip style={{marginTop: 50, width: 250}} title={"Haga click para " + (productState.is_featured ? "dejar de " : "")  + "destacar"}><StarIcon /></Tooltip></div>
                    <div className="admin-product-detail-date">{parseDate(new Date(productState.date*1000))}</div>
                    <div className={"admin-product-detail" + (productState.available ? "-stock" : "-nostock")}><Tooltip style={{marginTop: 38}} title={(productState.available ? "Deshabilitar el stock" : "Habilitar el stock")}>{productState.available ? "EN STOCK" : "SIN STOCK"}</Tooltip></div>
                </div>
            </div>
            <h3>Descripcion del producto</h3>
            <div contentEditable={true} className="admin-product-detail-description" onBlur={handleDescriptionChange} suppressContentEditableWarning={true}>{productState.description}</div>
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
            {(hasAnyChangesFlag) && 
                <div className="admin-product-detail-savecancel">
                    <button className="admin-product-details-save" onClick={saveChanges}>GUARDAR CAMBIOS</button>
                    <button className="admin-product-details-cancel" onClick={cancelChanges}>CANCELAR</button>
                </div>}
            <Overlay openState={addCategoriesOverlay} closeCallback={closeAddCategories}>
                <div className="selector-container" onClick={closeAddCategories}>
                    <div className="selector-body">
                        {renderCategoriesToAdd()}
                    </div>
                    <button onClick={closeAddCategories}>CANCELAR</button>
                </div>
            </Overlay>
        </div>
    );
};