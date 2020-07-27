import React, { useState } from "react";
import { TProduct, TProductImage, TCategory } from "../../../components/products";
import { parseDate } from "../../Utils";
import Tooltip from "../../home/components/Tooltip";
import LoadingCircle from "./LoadingCircle";

import ArrowBackIcon from "../../../assets/icons/arrow_back-24px.svg";
import StarIcon from "../../../assets/icons/star-24px.svg";
import RemoveIcon from "../../../assets/icons/remove_circle-24px.svg";
import AddIcon from "../../../assets/icons/baseline-add.svg";
import DoneIcon from "../../../assets/icons/done-24px.svg";
import CloseIcon from "../../../assets/icons/close.svg";
import Overlay from "../../home/components/Overlay";
import Snackbar, {SnackbarTime, SnackbarStyles} from "../../../components/Snackbar";
import Axios from "axios";

export interface ProductDetailProps {
    product: TProduct,
    productImages :TProductImage[],
    categories :TCategory[],
    refUrl :string,
    isNewProduct? :boolean
}

export default ({ product, productImages, categories, refUrl, isNewProduct} :ProductDetailProps) => {
    const [productState, setProductState] = useState<TProduct>(product);
    const [productImagesState, setProductImagesState] = useState<TProductImage[]>(productImages);
    const [hasAnyChangesFlag, setHasAnyChangesFlag] = useState<boolean>(false);
    const [snackbarActive, setSnackbarActive] = useState<boolean>(false);
    const [snackbarErrorActive, setSnackbarErrorActive] = useState<boolean>(false);
    const [categoriesToAdd, setCategoriesToAdd] = useState<TCategory[]>([]);
    const [addCategoriesOverlay, setAddCategoriesOverlay] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

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
            return {id: id, name: "categoria inexistente"};
        return category;
    };

    const openAddCategories = () => {
        const productCategories :number[] = JSON.parse(productState.categories);
        setCategoriesToAdd(categories.filter(c => productCategories.indexOf(c.id) === -1 && c.id !== 0));
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
        if (confirm("Estas seguro de borrar esta imagen?")) {
            const newProductImagesState = productImagesState.filter(i => i.id !== id);
            productState.primary_image_id = newProductImagesState[0]?.id || 0;
            Axios.delete(`/admin/productos/images/${id}/${productState.primary_image_id}`)
            .then(res => {
                if(res.status === 200) {
                    setProductImagesState(newProductImagesState);
                    setProductState({...productState});
                } else {
                    console.log("error: ", res);
                    activeErrorSnackbar();
                }
            }).catch(err => console.log(err));
        }
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

    const toggleStock = () => {
        productState.available = !productState.available;
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

    const submitProduct = () => {
        Axios.put("/admin/productos/" + productState.id, {
            data: productState
        }).then(res => {
            if (res.data.id) {
                document.location.href = "/admin/productos/" + res.data.id;
            }
            if (res.data.ok) {
                activeSuccessSnackbar();
                setHasAnyChangesFlag(false);
            } else throw(res);
        }).catch(err => {
            console.log(err);
            activeErrorSnackbar();
        });
    };

    const cancelChanges = () => {
        location.reload();
    };

    const removeProduct = () => {
        if (confirm("Estas seguro de borrar el producto?")) {
            Axios.delete("/admin/productos/" + productState.id).then(res => {
                if (res.status === 200) {
                    goBack();
                } else {
                    console.log("hubo un error");
                    activeErrorSnackbar();
                }
            });
        }
    }

    const promptImagesUpload = (productId :number) => () => {
        document.getElementById("admin-product-upload-images")?.click();
    }

    const uploadImagesOnChange = (ev :any) => {
        const files :FileList = ev.target.files;
        const data :FormData = new FormData();
        for (let i = 0; i< files.length; i++) {
            data.append('productImages', files[i]);
        }
        // we need to clear the input value to have onChange working correctly for newer uploads
        (document.getElementById("admin-product-upload-images") as HTMLInputElement).value = "";

        setIsLoading(true);
        data.append('productId', product.id.toString());
        Axios.post("/admin/productos/uploadImages",data)
            .then(res => {
                if (res.data.images) {
                    const images :TProductImage[] = res.data.images;
                    const productImages = [...productImagesState];
                    images.forEach(image => {
                        productImages.push(image);
                    });
                    setProductImagesState(productImages);
                    if(res.data.previousProductImagesCount === 0) {
                        productState.primary_image_id = productImages[0].id;
                        setProductState({...productState});;
                    }
                    setIsLoading(false);
                }
            })
            .catch(err => {
                setIsLoading(false);
                activeErrorSnackbar();
                console.log(err);
            });
    };

    const activeSuccessSnackbar = () => {
        setSnackbarActive(true);
        setTimeout(() => setSnackbarActive(false), SnackbarTime);
    };

    const activeErrorSnackbar = () => {
        setSnackbarErrorActive(true);
        setTimeout(() => setSnackbarErrorActive(false), SnackbarTime);
    };

    return (
        <div className="admin-product-detail-container">
            <button className="btn-light-blue admin-product-detail-goback" onClick={goBack}><ArrowBackIcon />VOLVER</button>
            <h3>Titulo</h3>
            <div className="admin-product-detail-header">
                <input className="admin-product-detail-title" defaultValue={productState.title} onChange={handleTitleChange} placeholder="Ingrese el titulo del producto." />
                <div className="admin-product-detail-data">
                    <div className={"admin-product-star" + (productState.is_featured ? "-active" : "")} onClick={toggleFeatured}><Tooltip style={{marginTop: 50, width: 250}} title={"Haga click para " + (productState.is_featured ? "dejar de " : "")  + "destacar"}><StarIcon /></Tooltip></div>
                    <div className="admin-product-detail-date">{parseDate(new Date(productState.date*1000))}</div>
                    <div className={"admin-product-detail" + (productState.available ? "-stock" : "-nostock")} onClick={toggleStock}><Tooltip style={{marginTop: 38}} title={(productState.available ? "Deshabilitar el stock" : "Habilitar el stock")}>{productState.available ? "EN STOCK" : "SIN STOCK"}</Tooltip></div>
                </div>
            </div>
            <h3>Descripcion del producto</h3>
            <div contentEditable={true} className="admin-product-detail-description" onBlur={handleDescriptionChange} suppressContentEditableWarning={true}>{productState.description}</div>
            <h3>Categorias</h3>
            <ul className="admin-product-detail-categories">
                {renderCategories()}
            </ul>
            <h3>Fotos</h3>
            {!isNewProduct ? <ul className="admin-product-detail-photos">
                {renderPhotos()}
                <div className="admin-product-detail-photos-add" onClick={promptImagesUpload(product.id)}><AddIcon /></div>
            </ul> : <div className="admin-product-detail-photos-newproductmsg">Para agregar fotos primero crea el producto.</div>}
            {!isNewProduct ? <div className="admin-product-detail-remove" onClick={removeProduct}><RemoveIcon />ELIMINAR PRODUCTO</div>
                : <div className="admin-product-detail-create" onClick={submitProduct}><AddIcon />CREAR PRODUCTO</div>}
            {!isNewProduct && hasAnyChangesFlag && 
                <div className="admin-product-detail-savecancel">
                    <button className="btn-light-blue btn-icon-rotate360" onClick={submitProduct}><DoneIcon />GUARDAR CAMBIOS</button>
                    <button className="btn-light-red" onClick={cancelChanges}><CloseIcon/> CANCELAR</button>
                </div>}
            <Overlay openState={addCategoriesOverlay} closeCallback={closeAddCategories}>
                <div className="selector-container" onClick={closeAddCategories}>
                    <div className="selector-body">
                        {renderCategoriesToAdd()}
                    </div>
                    <button onClick={closeAddCategories}>CANCELAR</button>
                </div>
            </Overlay>
            <input type="file" id="admin-product-upload-images" multiple={true} onChange={uploadImagesOnChange}/>
            <Snackbar type={SnackbarStyles.SUCCESS} message="Se han guardado los cambios" isActive={snackbarActive} />
            <Snackbar type={SnackbarStyles.ERROR} message="Hubo un error, por favor recarga la pagina." isActive={snackbarErrorActive} />
            <LoadingCircle openState={isLoading} />
        </div>
    );
};